import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CustomBadge from '@/components/custom/CustomBadge';
import { ReusableTable } from '@/components/table_components';
import { LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';
import { ClipboardList, Plus } from 'lucide-react';
import { CompactMedicalLogFilterBar } from '@/components/CompactMedicalLogFilterBar';
import RoleGuard from '@/components/RoleGuard';
import apiClient from '@/lib/axios';
import { enrichMedicalLogs } from '@/utils/enrichMedicalLogs';
import { formatDateTime, calculateLogStats, MEDICAL_LOG_BASE_COLUMNS } from '@/utils/medicalLogUtils';

const administeredAtColumnIndex = MEDICAL_LOG_BASE_COLUMNS.findIndex(
  (column) => column.accessorKey === 'administered_at'
);

const TABLE_COLUMNS = [
  ...MEDICAL_LOG_BASE_COLUMNS.slice(0, administeredAtColumnIndex + 1),
  { accessorKey: 'created_by_type', header: 'Created By Type', textSize: 'sm' },
  { accessorKey: 'creator_name', header: 'Creator Name', textSize: 'sm' },
  ...MEDICAL_LOG_BASE_COLUMNS.slice(administeredAtColumnIndex + 1),
];

const DEFAULT_VISIBLE_COLUMNS = [
  'animal_name',
  'logTypeBadge',
  'medication_name',
  'administered_at',
  'created_by_type',
  'creator_name',
  'logged_at',
  'general_notes',
  'dose',
];

function getMedicationFields(log) {
  const linkedMedicationName =
    typeof log?.medication?.item?.name === 'string' ? log.medication.item.name.trim() : '';
  const prescriptionText = typeof log?.prescription === 'string' ? log.prescription.trim() : '';
  const usesPrescriptionAsMedication = !linkedMedicationName && Boolean(prescriptionText);
  const hasMedicationContext = Boolean(
    linkedMedicationName ||
      prescriptionText ||
      log?.dose ||
      log?.administered_at ||
      log?.qty_administered != null
  );
  const medicationDisplayName = linkedMedicationName
    ? linkedMedicationName
    : prescriptionText
      ? prescriptionText
      : hasMedicationContext
        ? 'Medication name not logged'
        : null;

  return { prescriptionText, usesPrescriptionAsMedication, medicationDisplayName };
}

export const Route = createFileRoute('/_admin/timeline-view')({
  validateSearch: (search) => ({
    view: search?.view === 'table' ? 'table' : 'timeline',
  }),
  component: MedicalLogListPage,
});

function MedicalLogListPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const isTableView = search.view === 'table';

  const [filters, setFilters] = useState({
    search: '',
    dateRange: { from: null, to: null },
    logTypes: [],
    createdBy: 'all',
  });
  const [medicalLogs, setMedicalLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredLogs = useMemo(() => {
    return medicalLogs
      .filter((log) => {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = log.animal_name?.toLowerCase().includes(searchLower) ?? false;

        let matchesDateRange = true;
        const logDate = log.logged_at ? new Date(log.logged_at) : null;
        if (filters.dateRange.from && logDate && !isNaN(logDate.getTime())) {
          matchesDateRange = matchesDateRange && logDate >= filters.dateRange.from;
        }
        if (filters.dateRange.to && logDate && !isNaN(logDate.getTime())) {
          matchesDateRange = matchesDateRange && logDate <= filters.dateRange.to;
        }

        const matchesLogTypes =
          filters.logTypes.length === 0 || filters.logTypes.includes(log.category);

        let matchesCreatedBy = true;
        if (filters.createdBy === 'admin') {
          matchesCreatedBy = !log.foster_user_id;
        } else if (filters.createdBy === 'foster') {
          matchesCreatedBy = !!log.foster_user_id;
        }

        return matchesSearch && matchesDateRange && matchesLogTypes && matchesCreatedBy;
      })
      .sort((a, b) => {
        const dateA = a.logged_at ? new Date(a.logged_at).getTime() : 0;
        const dateB = b.logged_at ? new Date(b.logged_at).getTime() : 0;
        const timeA = isNaN(dateA) ? 0 : dateA;
        const timeB = isNaN(dateB) ? 0 : dateB;
        return timeB - timeA;
      });
  }, [medicalLogs, filters]);

  const { total: totalLogs, medical: medicalCount, behavioral: behavioralCount, veterinary: veterinaryCount } =
    calculateLogStats(medicalLogs);

  const tableData = useMemo(() => {
    return filteredLogs.map((log) => {
      const { medicationDisplayName, prescriptionText, usesPrescriptionAsMedication } =
        getMedicationFields(log);

      return {
        ...log,
        animal_name: log.animal_name || '—',
        medication_name: medicationDisplayName || '—',
        logTypeBadge: (
          <CustomBadge
            text={formatLogType(log.category)}
            badgeClassName={LOG_TYPE_COLORS[log.category] || 'bg-gray-100 text-gray-800'}
          />
        ),
        general_notes: log.general_notes || '—',
        behavior_notes: log.behavior_notes || '—',
        dose: log.dose || '—',
        qty_administered: log.qty_administered != null ? log.qty_administered : '—',
        administered_at: formatDateTime(log.administered_at),
        prescription: prescriptionText && !usesPrescriptionAsMedication ? prescriptionText : '—',
        created_by_type: log.foster_user_role === 'USER' ? 'Foster User' : 'Staff User',
        creator_name: log.foster_user_id ? log.foster_user_name : 'Staff User',
        logged_at: formatDateTime(log.logged_at),
      };
    });
  }, [filteredLogs]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/medical-logs');
      const rawLogs = response?.data || [];

      if (!Array.isArray(rawLogs)) {
        throw new Error('Unexpected response format from server: expected array of logs');
      }

      const animalIds = [...new Set(rawLogs.map((log) => log.animal_id).filter(Boolean))];
      const fosterUserIds = [...new Set(rawLogs.map((log) => log.foster_user_id).filter(Boolean))];

      let fetchedAnimals = [];
      let animalMap = new Map();

      if (animalIds.length > 0) {
        try {
          const allAnimalsResponse = await apiClient.get('/animals', { params: { limit: 1000 } });
          fetchedAnimals = allAnimalsResponse.data;
        } catch (e) {
          console.error('Failed to fetch all animals:', e);
        }

        animalMap = new Map(fetchedAnimals.map((a) => [a.id, a.name]));
        const missingAnimalIds = animalIds.filter((id) => !animalMap.has(id));

        if (missingAnimalIds.length > 0) {
          const individualFetches = missingAnimalIds.map((id) =>
            apiClient.get(`/animals/${id}`).catch((err) => {
              console.error('Failed to fetch animal', id, err);
              return null;
            })
          );
          const individualResponses = await Promise.all(individualFetches);

          individualResponses.forEach((animalResponse) => {
            if (animalResponse?.data) {
              animalMap.set(animalResponse.data.id, animalResponse.data.name);
              fetchedAnimals.push(animalResponse.data);
            }
          });
        }
      }

      let fetchedUsers = [];
      if (fosterUserIds.length > 0) {
        try {
          const usersResponse = await apiClient.get('/users');
          fetchedUsers = usersResponse?.data || [];
        } catch (e) {
          console.error('Failed to fetch users:', e);
        }
      }

      const enrichedLogs = enrichMedicalLogs(rawLogs, fetchedAnimals, fetchedUsers);
      setMedicalLogs(enrichedLogs);
    } catch (err) {
      console.error('Error fetching medical logs:', err);
      setError('Failed to load medical logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setView = (nextView) => {
    navigate({
      search: (prev) => ({ ...(prev || {}), view: nextView }),
      replace: true,
    });
  };

  if (error) {
    return (
      <RoleGuard allowedRoles={['STAFF']}>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl text-red-500">{error}</p>
          <Button variant="outline" onClick={fetchData}>
            Retry
          </Button>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['STAFF']}>
      <div className="space-y-6">
        <div className="sticky top-0 z-20 -mx-4 px-4 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50">
          <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
                  <ClipboardList className="size-6 sm:size-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Medical Logs
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    View and manage medical log entries for all animals.
                  </p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <Badge variant="secondary" className="font-medium">
                      {totalLogs} total logs
                    </Badge>
                    {medicalCount > 0 && (
                      <Badge
                        variant="outline"
                        className="font-medium border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                      >
                        {medicalCount} medical
                      </Badge>
                    )}
                    {behavioralCount > 0 && (
                      <Badge
                        variant="outline"
                        className="font-medium border-blue-500/30 text-blue-600 bg-blue-500/5"
                      >
                        {behavioralCount} behavioral
                      </Badge>
                    )}
                    {veterinaryCount > 0 && (
                      <Badge
                        variant="outline"
                        className="font-medium border-purple-500/30 text-purple-600 bg-purple-500/5"
                      >
                        {veterinaryCount} veterinary
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <div className="inline-flex items-center gap-1 rounded-md border p-1 bg-background">
                  <Button
                    type="button"
                    size="sm"
                    variant={isTableView ? 'ghost' : 'secondary'}
                    onClick={() => setView('timeline')}
                  >
                    Timeline
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={isTableView ? 'secondary' : 'ghost'}
                    onClick={() => setView('table')}
                  >
                    Table
                  </Button>
                </div>
                <Button
                  onClick={() => navigate({ to: '/medical-logs-add' })}
                  size="lg"
                  className="shrink-0 sm:self-center gap-2"
                >
                  <Plus className="size-5" />
                  Add Medical Log
                </Button>
              </div>
            </div>
          </div>

          <CompactMedicalLogFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            showCreatedBy={true}
            showAddNew={false}
          />
        </div>

        {isTableView ? (
          !loading && filteredLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No medical logs match your search.</p>
          ) : (
            <ReusableTable
              columns={TABLE_COLUMNS}
              data={tableData}
              isLoading={loading}
              headerClassName="bg-secondary text-primary-foreground"
              tablebodyRowClassName="bg-white hover:bg-secondary/20"
              containerClassName="rounded-lg border border-gray-200 shadow-sm relative w-full"
              enablePagination={true}
              enableColumnVisibility={true}
              pageSize={15}
              defaultVisibleColumns={DEFAULT_VISIBLE_COLUMNS}
            />
          )
        ) : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No medical logs match your search.</p>
        ) : (
          <div className="relative space-y-4">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />

            {filteredLogs.map((log) => {
              const creatorLabel =
                log.foster_user_role === 'USER'
                  ? `Foster: ${log.foster_user_name}`
                  : log.foster_user_role === 'STAFF'
                    ? `Staff: ${log.foster_user_name}`
                    : 'Staff log';
              const primaryNote = log.general_notes || log.behavior_notes || null;
              const secondaryNote =
                log.general_notes &&
                log.behavior_notes &&
                log.behavior_notes !== log.general_notes
                  ? log.behavior_notes
                  : null;
              const { medicationDisplayName, prescriptionText, usesPrescriptionAsMedication } =
                getMedicationFields(log);

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.3, margin: '-50px' }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="sm:ml-10 relative"
                >
                  <Card className="relative transition-shadow duration-300">
                    <div className="absolute -left-10 top-5 size-3 rounded-full bg-primary border-2 border-background hidden sm:block" />
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-start gap-2">
                        <CustomBadge
                          text={formatLogType(log.category)}
                          badgeClassName={LOG_TYPE_COLORS[log.category] || 'bg-gray-100 text-gray-800'}
                        />
                        <p className="text-sm font-semibold leading-tight pt-0.5">{log.animal_name}</p>
                        <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
                          {log.logged_at
                            ? `${new Date(log.logged_at).toLocaleDateString()} ${new Date(
                                log.logged_at
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}`
                            : '—'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">{creatorLabel}</p>
                      {primaryNote && <p className="text-base text-foreground leading-relaxed">{primaryNote}</p>}
                      {secondaryNote && (
                        <p className="text-base text-foreground leading-relaxed mt-1">{secondaryNote}</p>
                      )}
                      <div className="space-y-1 mt-2">
                        {medicationDisplayName && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Medication:</span> {medicationDisplayName}
                          </p>
                        )}
                        {prescriptionText && !usesPrescriptionAsMedication && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Rx:</span> {prescriptionText}
                          </p>
                        )}
                        {log.dose && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Dose:</span> {log.dose}
                            {log.qty_administered != null && ` × ${log.qty_administered}`}
                          </p>
                        )}
                        {log.administered_at && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Administered:</span>{' '}
                            {new Date(log.administered_at).toLocaleDateString()}{' '}
                            {new Date(log.administered_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
