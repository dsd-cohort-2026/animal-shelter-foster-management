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
import { formatDateTime, calculateLogStats, MEDICAL_LOG_BASE_COLUMNS } from '@/utils/medicalLogUtils';
import { enrichMedicalLogs, buildEnrichmentMaps } from '@/utils/enrichMedicalLogs';

export const Route = createFileRoute('/_admin/admin-medical-logs')({
  id: '/admin-medical-logs',
  component: AdminLogsPage,
});

function AdminLogsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    dateRange: { from: null, to: null },
    logTypes: [],
    createdBy: 'all',
  });
  const [allLogs, setAllLogs] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const filteredLogs = useMemo(() => {
    return allLogs
      .filter((log) => {
        // Search filter
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = log.animal_name?.toLowerCase().includes(searchLower) ?? false;

        // Log type filter (now an array)
        const matchesLogTypes =
          filters.logTypes.length === 0 || filters.logTypes.includes(log.category);

        // Date range filter - safely parse dates to avoid "Invalid Date" comparisons
        let matchesDateRange = true;
        const logDate = log.logged_at ? new Date(log.logged_at) : null;
        if (filters.dateRange.from && logDate && !isNaN(logDate.getTime())) {
          matchesDateRange = matchesDateRange && logDate >= filters.dateRange.from;
        }
        if (filters.dateRange.to && logDate && !isNaN(logDate.getTime())) {
          matchesDateRange = matchesDateRange && logDate <= filters.dateRange.to;
        }

        // Created by filter
        let matchesCreatedBy = true;
        if (filters.createdBy === 'admin') {
          matchesCreatedBy = !log.foster_user_id;
        } else if (filters.createdBy === 'foster') {
          matchesCreatedBy = !!log.foster_user_id;
        }

        return matchesSearch && matchesLogTypes && matchesDateRange && matchesCreatedBy;
      })
      .sort((a, b) => {
        // Safe date comparison - default to 0 (epoch) for missing/invalid dates
        const dateA = a.logged_at ? new Date(a.logged_at).getTime() : 0;
        const dateB = b.logged_at ? new Date(b.logged_at).getTime() : 0;
        // Handle invalid dates (NaN) by treating them as 0
        const timeA = isNaN(dateA) ? 0 : dateA;
        const timeB = isNaN(dateB) ? 0 : dateB;
        return timeB - timeA; // Descending order (newest first)
      });
  }, [allLogs, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch medical logs first
      const logsResponse = await apiClient.get('/medical-logs' , {  page: 1, limit: 100 } );
      const rawLogs = logsResponse?.data || [];

      // Validate response is an array
      if (!Array.isArray(rawLogs)) {
        throw new Error('Unexpected response format from server: expected array of logs');
      }

      // Extract unique animal IDs from logs
      const animalIds = [...new Set(rawLogs.map(log => log.animal_id).filter(Boolean))];

      // Extract unique foster user IDs from logs
      const fosterUserIds = [...new Set(rawLogs.map(log => log.foster_user_id).filter(Boolean))];

      // Fetch animals - try all animals first, then fallback to individual fetches
      let fetchedAnimals = [];
      let animalMap = new Map();

      if (animalIds.length > 0) {
        // Try fetching all animals (works for STAFF)
        try {
          const allAnimalsResponse = await apiClient.get('/animals');
          fetchedAnimals = allAnimalsResponse.data;
        } catch (e) {
          console.error('Failed to fetch all animals:', e);
        }

        // Create initial map from fetched animals
        animalMap = new Map(fetchedAnimals.map(a => [a.id, a.name]));

        // For any animals not found, fetch them individually
        const missingAnimalIds = animalIds.filter(id => !animalMap.has(id));

        if (missingAnimalIds.length > 0) {
          const individualFetches = missingAnimalIds.map(id =>
            apiClient.get(`/animals/${id}`).catch(() => null)
          );
          const individualResponses = await Promise.all(individualFetches);

          individualResponses.forEach(response => {
            if (response?.data) {
              animalMap.set(response.data.id, response.data.name);
              fetchedAnimals.push(response.data);
            }
          });
        }
      }

      // Fetch foster users
      let fetchedUsers = [];
      let userMap = new Map();

      if (fosterUserIds.length > 0) {
        try {
          const usersResponse = await apiClient.get('/users');
          fetchedUsers = usersResponse.data;

          // Create user name map (first_name + last_name)
          userMap = new Map(fetchedUsers.map(u => [
            u.id,
            `${u.first_name} ${u.last_name}`.trim() || u.email
          ]));
        } catch (e) {
          console.error('Failed to fetch users:', e);
        }
      }

      // Enrich logs using centralized utility
      const enrichedLogs = enrichMedicalLogs(rawLogs, fetchedAnimals, fetchedUsers);

      setAnimals(fetchedAnimals);
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

  // Stats for header
  const { total: totalLogs, medical: medicalCount, behavioral: behavioralCount, veterinary: veterinaryCount } = calculateLogStats(allLogs);

  // Admin columns = base columns + created_by_type and creator_name after administered_at
  const columns = [
    ...MEDICAL_LOG_BASE_COLUMNS.slice(0, 5), // animal_name through administered_at
    { accessorKey: 'created_by_type', header: 'Created By Type', textSize: 'sm' },
    { accessorKey: 'creator_name', header: 'Creator Name', textSize: 'sm' },
    ...MEDICAL_LOG_BASE_COLUMNS.slice(5), // logged_at through behavior_notes
  ];

  const tableData = filteredLogs.map((log) => ({
    ...log,
    animal_name: log.animal_name || '—',
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
    prescription: log.prescription || '—',
    created_by_type: log.foster_user_id ? 'Foster' : 'Staff',
    creator_name: log.foster_user_id ? log.foster_user_name : 'Staff User',
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
            onClick={() => navigate({ to: '/medical-logs-add' })}
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
            'created_by_type',
            'creator_name',
            'logged_at',
            'general_notes',
            'dose',
          ]}
        />
      )}
    </>
  );
}