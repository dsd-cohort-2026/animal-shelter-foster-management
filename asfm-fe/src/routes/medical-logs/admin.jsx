import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardPlus, Plus } from 'lucide-react';
import { ReusableTable } from '@/components/table_components';
import CustomBadge from '@/components/custom/CustomBadge';
import RoleGuard from '@/components/RoleGuard';
import { useBoundStore } from '@/store';
import { LOG_TYPE_OPTIONS, LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';
import { CompactMedicalLogFilterBar } from '@/components/CompactMedicalLogFilterBar';

function ExpandableText({ text }) {
  const [expanded, setExpanded] = useState(false);

  if (!text || text === '—') return <span className="text-muted-foreground">—</span>;

  const isLong = text.length > 50;

  if (!isLong) return <span>{text}</span>;

  return (
    <button
      type="button"
      onClick={() => setExpanded((prev) => !prev)}
      className="text-left cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 transition-colors"
    >
      {expanded ? (
        <span>
          {text} <span className="text-xs text-primary underline">less</span>
        </span>
      ) : (
        <span className="line-clamp-2">
          {text.slice(0, 150)}… <span className="text-xs text-primary underline">more</span>
        </span>
      )}
    </button>
  );
}

export const Route = createFileRoute('/medical-logs/admin')({
  component: AdminLogsPage,
});

function AdminLogsPage() {
  const medicalLogs = useBoundStore((state) => state.medicalLogs);
  const medicalLogsLoading = useBoundStore((state) => state.medicalLogsLoading);
  const medicalLogsError = useBoundStore((state) => state.medicalLogsError);
  const fetchMedicalLogs = useBoundStore((state) => state.fetchMedicalLogs);

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    dateRange: { from: null, to: null },
    logTypes: [],
    createdBy: 'all',
  });
  const sortBy = 'date-desc';

  useEffect(() => {
    fetchMedicalLogs();
  }, [fetchMedicalLogs]);

  const filtered = useMemo(() => {
    return medicalLogs
      .filter((log) => {
        // Search filter
        const matchesSearch = log.animal_name.toLowerCase().includes(filters.search.toLowerCase());

        // Date range filter
        let matchesDateRange = true;
        if (filters.dateRange.from) {
          matchesDateRange = matchesDateRange && new Date(log.logged_at) >= filters.dateRange.from;
        }
        if (filters.dateRange.to) {
          matchesDateRange = matchesDateRange && new Date(log.logged_at) <= filters.dateRange.to;
        }

        // Log type filter
        const matchesLogTypes =
          filters.logTypes.length === 0 || filters.logTypes.includes(log.category);

        // Created by filter
        let matchesCreatedBy = true;
        if (filters.createdBy === 'admin') {
          matchesCreatedBy = !log.foster_user_id;
        } else if (filters.createdBy === 'foster') {
          matchesCreatedBy = !!log.foster_user_id;
        }

        return matchesSearch && matchesDateRange && matchesLogTypes && matchesCreatedBy;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'date-asc':
            return new Date(a.logged_at) - new Date(b.logged_at);
          case 'administered-desc':
            return new Date(b.administered_at || 0) - new Date(a.administered_at || 0);
          case 'administered-asc':
            return new Date(a.administered_at || 0) - new Date(b.administered_at || 0);
          case 'date-desc':
          default:
            return new Date(b.logged_at) - new Date(a.logged_at);
        }
      });
  }, [medicalLogs, filters, sortBy]);

  // Stats for header
  const totalLogs = medicalLogs.length;
  const medicalCount = medicalLogs.filter((l) => l.category === 'MEDICAL').length;
  const behavioralCount = medicalLogs.filter((l) => l.category === 'BEHAVIORAL').length;
  const veterinaryCount = medicalLogs.filter((l) => l.category === 'VETERINARY').length;

  // Columns match the Prisma MedicalLog model fields
  // Short/structured columns first, long text columns last
  const columns = [
    { accessorKey: 'animal_name', header: 'Animal' },
    {
      accessorKey: 'logTypeBadge',
      header: 'Log Type',
      headClassName: 'text-center',
      cellClassName: 'text-center',
    },
    { accessorKey: 'doseDisplay', header: 'Dose' },
    { accessorKey: 'qtyDisplay', header: 'Qty' },
    { accessorKey: 'administeredAtDisplay', header: 'Administered At' },
    { accessorKey: 'fosterUser', header: 'Foster User' },
    { accessorKey: 'loggedAtDisplay', header: 'Logged At' },
    { accessorKey: 'prescriptionDisplay', header: 'Prescription', cellClassName: 'whitespace-normal max-w-md' },
    { accessorKey: 'generalNotes', header: 'General Notes', cellClassName: 'whitespace-normal max-w-md' },
    { accessorKey: 'behaviorNotes', header: 'Behavior Notes', cellClassName: 'whitespace-normal max-w-md' },
    { accessorKey: 'documentsDisplay', header: 'Documents', cellClassName: 'whitespace-normal max-w-md' },
  ];

  const tableData = filtered.map((log) => ({
    ...log,
    logTypeBadge: (
      <CustomBadge
        text={formatLogType(log.category)}
        badgeClassName={LOG_TYPE_COLORS[log.category]}
      />
    ),
    generalNotes: log.general_notes || '—',
    behaviorNotes: <ExpandableText text={log.behavior_notes} />,
    doseDisplay: log.dose || '—',
    qtyDisplay: log.qty_administered != null ? log.qty_administered : '—',
    administeredAtDisplay: log.administered_at
      ? new Date(log.administered_at).toLocaleString()
      : '—',
    prescriptionDisplay: log.prescription || '—',
    fosterUser: log.foster_user_id || '—',
    loggedAtDisplay: new Date(log.logged_at).toLocaleString(),
    documentsDisplay: log.documents || '—',
  }));

  if (medicalLogsError) {
    return (
      <Layout>
        <RoleGuard allowedRoles={['STAFF']}>
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-xl text-red-500">{medicalLogsError}</p>
            <Button variant="outline" onClick={() => fetchMedicalLogs()}>
              Retry
            </Button>
          </div>
        </RoleGuard>
      </Layout>
    );
  }

  return (
    <Layout>
      <RoleGuard allowedRoles={['STAFF']}>
        <div className="flex flex-col gap-6 h-full">
          {/* Dashboard Header Card */}
          <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
                  <ClipboardPlus className="size-6 sm:size-7 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                    Admin Medical Logs
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Full visibility into all medical log entries across the shelter.
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
              <Button
                onClick={() => navigate({ to: '/medical-logs/add' })}
                size="lg"
                className="shrink-0 sm:self-start gap-2"
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
          />

          {!medicalLogsLoading && filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No medical logs match your search.
            </p>
          ) : (
            <ReusableTable
              columns={columns}
              data={tableData}
              isLoading={medicalLogsLoading}
              headerClassName="bg-secondary text-primary-foreground"
              tablebodyRowClassName="bg-white hover:bg-secondary/20"
              containerClassName="rounded-lg border border-gray-200 shadow-sm relative w-full"
              enablePagination={true}
              enableColumnVisibility={true}
              pageSize={15}
              defaultVisibleColumns={[
                'animal_name',
                'logTypeBadge',
                'administeredAtDisplay',
                'fosterUser',
                'loggedAtDisplay',
                'generalNotes',
                'doseDisplay',
              ]}
            />
          )}
        </div>
      </RoleGuard>
    </Layout>
  );
}
