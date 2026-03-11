import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardPlus, Plus } from 'lucide-react';
import { ReusableTable } from '@/components/table_components';
import CustomBadge from '@/components/custom/CustomBadge';
import { LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';
import { CompactMedicalLogFilterBar } from '@/components/CompactMedicalLogFilterBar';
import apiClient from '@/lib/axios';
import { useBoundStore } from '@/store';
import { formatDateTime, calculateLogStats, MEDICAL_LOG_BASE_COLUMNS } from '@/utils/medicalLogUtils';

export const Route = createFileRoute('/_user/medical-logs-foster')({
  component: FosterLogsPage,
});

function FosterLogsPage() {
  const navigate = useNavigate();
  const user = useBoundStore((state) => state.user);
  const [filters, setFilters] = useState({
    search: '',
    dateRange: { from: null, to: null },
    logTypes: [],
    createdBy: 'all',
  });
  const [allLogs, setAllLogs] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [assignedAnimalIds, setAssignedAnimalIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create animal lookup for efficient enrichment
  const animalLookup = useMemo(() => {
    return animals.reduce((acc, animal) => {
      acc[animal.id] = animal.name;
      return acc;
    }, {});
  }, [animals]);

  const filteredLogs = useMemo(() => {
    return allLogs
      .filter((log) => {
        // First filter: only logs for animals currently assigned to this foster
        if (!assignedAnimalIds.has(log.animal_id)) return false;

        // Search filter
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          log.animal_name?.toLowerCase().includes(searchLower) ||
          log.general_notes?.toLowerCase().includes(searchLower);

        // Log type filter (now an array)
        const matchesLogTypes =
          filters.logTypes.length === 0 || filters.logTypes.includes(log.category);

        // Date range filter
        let matchesDateRange = true;
        if (filters.dateRange.from) {
          matchesDateRange = matchesDateRange && new Date(log.logged_at) >= filters.dateRange.from;
        }
        if (filters.dateRange.to) {
          matchesDateRange = matchesDateRange && new Date(log.logged_at) <= filters.dateRange.to;
        }

        return matchesSearch && matchesLogTypes && matchesDateRange;
      })
      .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  }, [allLogs, filters, assignedAnimalIds]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Fetch user's currently assigned animals (same as "My Animals")
      const myAnimalsResponse = await apiClient.get('/animals');
      const myAnimals = myAnimalsResponse.data || [];

      // Build set of currently assigned animal IDs
      const currentAssignedIds = new Set(myAnimals.map(animal => animal.id));
      setAssignedAnimalIds(currentAssignedIds);

      if (currentAssignedIds.size === 0) {
        // No assigned animals, nothing to show
        setAnimals([]);
        setAllLogs([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch all medical logs
      const logsResponse = await apiClient.get('/medical-logs');
      console.log('Fetched medical logs:', logsResponse);

      // Step 3: Filter logs to only those for current user's assigned animals
      const logsForAssignedAnimals = logsResponse.data.filter(log =>
        currentAssignedIds.has(log.animal_id)
      );

      // Step 4: Build animal lookup from my assigned animals
      const animalMap = new Map(myAnimals.map(a => [a.id, a.name]));

      // Step 5: Enrich logs with animal names
      // Note: We don't fetch users list (STAFF-only API)
      // Foster user name is not displayed since these are the current user's own logs
      const enrichedLogs = logsForAssignedAnimals.map(log => {
        const animalName = animalMap.get(log.animal_id);
        return {
          ...log,
          animal_name: animalName || '—',
          foster_user_name: '—', // Not shown for foster's own logs
        };
      });

      setAnimals(myAnimals);
      setAllLogs(enrichedLogs);
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

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateRange: { from: null, to: null },
      logTypes: [],
      createdBy: 'all',
    });
  };

  // Stats for header - logs for currently assigned animals only
  const { total: totalLogs, medical: medicalCount, behavioral: behavioralCount, veterinary: veterinaryCount } = calculateLogStats(allLogs);

  const columns = MEDICAL_LOG_BASE_COLUMNS;

  const tableData = filteredLogs.map((log) => ({
    ...log,
    animal_name: log.animal_name || '—',
    logTypeBadge: (
      <CustomBadge
        text={formatLogType(log.category)}
        badgeClassName={LOG_TYPE_COLORS[log.category]}
      />
    ),
    general_notes: log.general_notes || '—',
    behavior_notes: log.behavior_notes || '—',
    dose: log.dose || '—',
    qty_administered: log.qty_administered != null ? log.qty_administered : '—',
    administered_at: formatDateTime(log.administered_at),
    prescription: log.prescription || '—',
    logged_at: formatDateTime(log.logged_at),
  }));

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-xl text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchData}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
              <ClipboardPlus className="size-6 sm:size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                Foster Medical Logs
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                View medical logs for animals under foster care.
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge variant="secondary" className="font-medium">
                  {totalLogs} foster logs
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
          <Button
            onClick={() => navigate({ to: '/add-medical-log' })}
            size="lg"
            className="shrink-0 sm:self-center gap-2"
          >
            <Plus className="size-5" />
            Add Medical Log
          </Button>
        </div>
      </div>

      <CompactMedicalLogFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        showAddNew={false}
        showCreatedBy={false}
      />

      {!loading && filteredLogs.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No medical logs match your search.
        </p>
      ) : (
        <ReusableTable
          columns={columns}
          data={tableData}
          isLoading={loading}
          headerClassName="bg-secondary text-primary-foreground"
          tablebodyRowClassName="bg-white hover:bg-secondary/20"
          containerClassName="rounded-lg border border-gray-200 shadow-sm relative w-full"
          enablePagination={true}
          enableColumnVisibility={true}
          pageSize={15}
          defaultVisibleColumns={[
            'animal_name',
            'logTypeBadge',
            'administered_at',
            'logged_at',
            'general_notes',
            'dose',
          ]}
        />
      )}
    </>
  );
}