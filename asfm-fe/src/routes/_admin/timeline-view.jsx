import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CustomBadge from '@/components/custom/CustomBadge';
import { LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';
import { ClipboardList, Plus } from 'lucide-react';
import { CompactMedicalLogFilterBar } from '@/components/CompactMedicalLogFilterBar';
import RoleGuard from '@/components/RoleGuard';
import apiClient from '@/lib/axios';

export const Route = createFileRoute('/_admin/timeline-view')({ component: MedicalLogListPage });

function MedicalLogListPage() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    search: '',
    dateRange: { from: null, to: null },
    logTypes: [],
    createdBy: 'all',
  });

  const [medicalLogs, setMedicalLogs] = useState([]);
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

  const filtered = useMemo(() => {
    return medicalLogs
      .map((log) => ({
        ...log,
        animal_name: animalLookup[log.animal_id] || 'Unknown Animal',
      }))
      .filter((log) => {
        // Search filter
        const matchesSearch = log.animal_name?.toLowerCase().includes(filters.search.toLowerCase()) ?? false;

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
      .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  }, [medicalLogs, filters, animalLookup]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/medical-logs');
      const rawLogs = response?.data || [];

      // Validate response is an array
      if (!Array.isArray(rawLogs)) {
        throw new Error('Unexpected response format from server: expected array of logs');
      }

      setMedicalLogs(rawLogs);

      // Extract unique animal IDs from logs
      const animalIds = [...new Set(rawLogs.map(log => log.animal_id).filter(Boolean))];

      // Fetch animals
      let fetchedAnimals = [];
      let animalMap = new Map();

      if (animalIds.length > 0) {
        // Try fetching all animals first
        try {
          const allAnimalsResponse = await apiClient.get('/animals', { params: { limit: 1000 } }); //  Correct way to do it 
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
            apiClient.get(`/animals/${id}`).catch(err => {
              console.error('Failed to fetch animal', id, err);
              return null;
            })
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

      
      setAnimals(fetchedAnimals);
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
          {/* Header */}
          <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="space-y-4">
            <CompactMedicalLogFilterBar
              filters={filters}
              onFiltersChange={setFilters}
              showCreatedBy={true}
              showAddNew={false}
            />
          </div>

          {/* Timeline */}
          {loading ? (
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
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No medical logs match your search.
            </p>
          ) : (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />

              {filtered.map((log) => (
                <Card key={log.id} className="sm:ml-10 relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-10 top-5 size-3 rounded-full bg-primary border-2 border-background hidden sm:block" />
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CustomBadge
                        text={formatLogType(log.category)}
                        badgeClassName={LOG_TYPE_COLORS[log.category] || 'bg-gray-100 text-gray-800'}
                      />
                      <span className="text-sm font-semibold">{log.animal_name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {log.logged_at
                          ? `${new Date(log.logged_at).toLocaleDateString()} ${new Date(log.logged_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`
                          : '—'}
                      </span>
                    </div>
                    {log.general_notes && (
                      <p className="text-sm text-foreground">{log.general_notes}</p>
                    )}
                    {log.behavior_notes && (
                      <p className="text-sm text-muted-foreground mt-1">{log.behavior_notes}</p>
                    )}
                    {log.prescription && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="font-medium">Rx:</span> {log.prescription}
                      </p>
                    )}
                    {log.dose && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Dose:</span> {log.dose}
                        {log.qty_administered != null && ` × ${log.qty_administered}`}
                      </p>
                    )}
                    {log.administered_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-medium">Administered:</span>{' '}
                        {new Date(log.administered_at).toLocaleDateString()} {new Date(log.administered_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </RoleGuard>
  );
}
