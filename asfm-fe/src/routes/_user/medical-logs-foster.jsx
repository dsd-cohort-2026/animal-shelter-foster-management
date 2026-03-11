import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardPlus, Plus } from 'lucide-react';
import { ReusableTable } from '@/components/table_components';
import CustomBadge from '@/components/custom/CustomBadge';
import { LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';
import FilterBar from '@/components/FilterBar';
import FilterSelect from '@/components/custom/FilterSelect';
import InputGroupForSearch from '@/components/InputGroupForSearch';
import apiClient from '@/lib/axios';

const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString();
};

export const Route = createFileRoute('/_user/medical-logs-foster')({
  component: FosterLogsPage,
});

function FosterLogsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    dateRange: { from: null, to: null },
  });
  const [allLogs, setAllLogs] = useState([]);
  const [animals, setAnimals] = useState([]);
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
        // First filter: only foster logs
        if (!log.foster_user_id) return false;

        // Search filter
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          log.animal_name?.toLowerCase().includes(searchLower) ||
          log.general_notes?.toLowerCase().includes(searchLower);

        // Category filter
        const matchesCategory = !filters.category || log.category === filters.category;

        // Date range filter
        let matchesDateRange = true;
        if (filters.dateRange.from) {
          matchesDateRange = matchesDateRange && new Date(log.logged_at) >= filters.dateRange.from;
        }
        if (filters.dateRange.to) {
          matchesDateRange = matchesDateRange && new Date(log.logged_at) <= filters.dateRange.to;
        }

        return matchesSearch && matchesCategory && matchesDateRange;
      })
      .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  }, [allLogs, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch medical logs first
      const logsResponse = await apiClient.get('/medical-logs');

      // Extract unique animal IDs from logs
      const animalIds = [...new Set(logsResponse.data.map(log => log.animal_id).filter(Boolean))];

      // Extract unique foster user IDs from logs
      const fosterUserIds = [...new Set(logsResponse.data.map(log => log.foster_user_id).filter(Boolean))];

      // Fetch animals - try all animals first, then fallback to individual fetches
      let animals = [];
      let animalMap = new Map();

      if (animalIds.length > 0) {
        // Try fetching all animals (works for STAFF)
        try {
          const allAnimalsResponse = await apiClient.get('/animals');
          animals = allAnimalsResponse.data;
          console.log('Fetched', animals.length, 'animals');
        } catch (e) {
          console.error('Failed to fetch all animals:', e);
        }

        // Create initial map from fetched animals
        animalMap = new Map(animals.map(a => [a.id, a.name]));

        // For any animals not found, fetch them individually
        const missingAnimalIds = animalIds.filter(id => !animalMap.has(id));

        if (missingAnimalIds.length > 0) {
          console.log('Fetching missing animals individually:', missingAnimalIds.length);
          const individualFetches = missingAnimalIds.map(id =>
            apiClient.get(`/animals/${id}`).catch(err => {
              console.error('Failed to fetch animal', id, err);
              return null;
            })
          );
          const individualResponses = await Promise.all(individualFetches);

          individualResponses.forEach(response => {
            if (response?.data) {
              animalMap.set(response.data.id, response.data.name);
              animals.push(response.data);
            }
          });
        }

        console.log('Final animal map size:', animalMap.size, 'out of', animalIds.length, 'animal IDs');
        console.log('Animal map entries:', Array.from(animalMap.entries()));
      }

      // Fetch foster users
      let users = [];
      let userMap = new Map();

      if (fosterUserIds.length > 0) {
        try {
          const usersResponse = await apiClient.get('/users');
          users = usersResponse.data;

          // Create user name map (first_name + last_name)
          userMap = new Map(users.map(u => [
            u.id,
            `${u.first_name} ${u.last_name}`.trim() || u.email
          ]));
        } catch (e) {
          console.error('Failed to fetch users:', e);
        }
      }

      // Enrich logs with animal names and foster user names
      const enrichedLogs = logsResponse.data.map(log => {
        const animalName = animalMap.get(log.animal_id);
        const fosterUserName = userMap.get(log.foster_user_id);
        return {
          ...log,
          animal_name: animalName || '—',
          foster_user_name: fosterUserName || '—',
          // Add a flag for orphaned logs
          is_orphaned: !animalName,
        };
      });

      // Log orphaned logs for debugging
      const orphanedCount = enrichedLogs.filter(log => log.is_orphaned).length;
      if (orphanedCount > 0) {
        console.warn(`⚠️ Found ${orphanedCount} orphaned logs (invalid animal_id)`);
        enrichedLogs.filter(log => log.is_orphaned).forEach(log => {
          console.warn(`  Log ID: ${log.id}, Invalid animal_id: ${log.animal_id}`);
        });
      }

      setAnimals(animals);
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
      category: '',
      dateRange: { from: null, to: null },
    });
  };

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(allLogs.map(log => log.category).filter(Boolean))];
    return uniqueCategories;
  }, [allLogs]);

  // Create category labels map
  const categoryLabelsMap = useMemo(() => {
    const labels = {};
    allLogs.forEach(log => {
      if (log.category && !labels[log.category]) {
        labels[log.category] = formatLogType(log.category);
      }
    });
    return labels;
  }, [allLogs]);

  // Stats for header - foster-permitted logs only
  const fosterLogs = allLogs.filter((log) => log.foster_user_id);
  const totalLogs = fosterLogs.length;
  const medicalCount = fosterLogs.filter((l) => l.category === 'MEDICAL').length;
  const behavioralCount = fosterLogs.filter((l) => l.category === 'BEHAVIORAL').length;
  const veterinaryCount = fosterLogs.filter((l) => l.category === 'VETERINARY').length;

  const columns = [
    { accessorKey: 'animal_name', header: 'Animal', textSize: 'sm' },
    {
      accessorKey: 'logTypeBadge',
      header: 'Log Type',
      headClassName: 'text-center',
      cellClassName: 'text-center',
      textSize: 'sm',
    },
    { accessorKey: 'dose', header: 'Dose', textSize: 'sm' },
    { accessorKey: 'qty_administered', header: 'Qty', textSize: 'sm' },
    { accessorKey: 'administered_at', header: 'Administered At', textSize: 'sm' },
    { accessorKey: 'logged_at', header: 'Logged At', textSize: 'sm' },
    {
      accessorKey: 'prescription',
      header: 'Prescription',
      cellClassName: 'whitespace-normal max-w-md',
      textSize: 'sm',
    },
    {
      accessorKey: 'general_notes',
      header: 'General Notes',
      cellClassName: 'whitespace-normal max-w-md',
      textSize: 'sm',
    },
    {
      accessorKey: 'behavior_notes',
      header: 'Behavior Notes',
      cellClassName: 'whitespace-normal max-w-md',
      textSize: 'sm',
    },
  ];

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

      <FilterBar
        onFilter={() => {}}
        onClear={handleClearFilters}
        onAddNew={() => navigate({ to: '/user-medical-logs-add' })}
        addNewButtonLabel="Add Medical Log"
      >
        <InputGroupForSearch
          placeholder_text="Search by animal or notes"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FilterSelect
          value={filters.category}
          onChange={(value) => setFilters({ ...filters, category: value })}
          selectItems={categories}
          selectItemsMap={categoryLabelsMap}
        />
      </FilterBar>

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