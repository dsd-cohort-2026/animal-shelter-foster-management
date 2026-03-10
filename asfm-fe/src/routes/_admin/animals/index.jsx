import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ReusableTable } from '@/components/table_components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/custom/CustomBadge';
import { useBoundStore } from '@/store';
import { PawPrint, Plus } from 'lucide-react';
import {
  STATUS_COLORS,
  SPECIES_OPTIONS,
  STATUS_OPTIONS,
  formatStatus,
  formatSpecies,
  formatSex,
} from '@/constants/animalConstants';

export const Route = createFileRoute('/_admin/animals/')({
  component: AnimalListPage,
});

function AnimalListPage() {
  const navigate = useNavigate();
  const animals = useBoundStore((state) => state.animals);
  const animalsLoading = useBoundStore((state) => state.animalsLoading);
  const animalsError = useBoundStore((state) => state.animalsError);
  const fetchAnimals = useBoundStore((state) => state.fetchAnimals);

  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const filtered = useMemo(() => {
    return animals.filter((a) => {
      const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpecies = speciesFilter === 'all' || a.species === speciesFilter;
      const matchesStatus = statusFilter === 'all' || a.foster_status === statusFilter;
      return matchesSearch && matchesSpecies && matchesStatus;
    });
  }, [animals, search, speciesFilter, statusFilter]);

  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'chip_id', header: 'Chip ID' },
    { accessorKey: 'species', header: 'Species' },
    { accessorKey: 'sex', header: 'Sex' },
    { accessorKey: 'weight', header: 'Weight (lbs)' },
    {
      accessorKey: 'statusBadge',
      header: 'Status',
      headClassName: 'text-center',
      cellClassName: 'text-center',
    },
    {
      accessorKey: 'actions',
      header: '',
      headClassName: 'w-[80px]',
    },
  ];

  const tableData = filtered.map((animal) => ({
    ...animal,
    species: formatSpecies(animal.species),
    sex: formatSex(animal.sex),
    statusBadge: (
      <CustomBadge
        text={formatStatus(animal.foster_status)}
        badgeClassName={STATUS_COLORS[animal.foster_status]}
      />
    ),
    actions: (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate({ to: '/animals/$animalId', params: { animalId: animal.id } })}
      >
        View
      </Button>
    ),
  }));

  // Calculate stats for dashboard using server schema statuses
  const totalAnimals = animals.length;
  const shelteredCount = animals.filter(a => a.foster_status === 'SHELTERED').length;
  const fosteredCount = animals.filter(a => a.foster_status === 'FOSTERED').length;
  const adoptedCount = animals.filter(a => a.foster_status === 'ADOPTED').length;
  const speciesCount = [...new Set(animals.map(a => a.species))].length;

  if (animalsError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-xl text-red-500">{animalsError}</p>
          <Button variant="outline" onClick={() => fetchAnimals()}>
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Dashboard Header Card */}
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
                <PawPrint className="size-6 sm:size-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                  Animals Dashboard
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Monitor and manage your shelter animals and their status.
                </p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <Badge variant="secondary" className="font-medium">
                    {totalAnimals} animals tracked
                  </Badge>
                  {shelteredCount > 0 && (
                    <Badge variant="outline" className="font-medium border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                      {shelteredCount} sheltered
                    </Badge>
                  )}
                  {fosteredCount > 0 && (
                    <Badge variant="outline" className="font-medium border-blue-500/30 text-blue-600 bg-blue-500/5">
                      {fosteredCount} fostered
                    </Badge>
                  )}
                  {adoptedCount > 0 && (
                    <Badge variant="outline" className="font-medium border-purple-500/30 text-purple-600 bg-purple-500/5">
                      {adoptedCount} adopted
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={() => navigate({ to: '/animals/add' })} size="lg" className="shrink-0 sm:self-start gap-2">
              <Plus className="size-5" />
              Add Animal
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-60"
          />
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              {SPECIES_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!animalsLoading && filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No animals match your search.</p>
        ) : (
          <ReusableTable
            columns={columns}
            data={tableData}
            isLoading={animalsLoading}
            headerClassName="bg-secondary text-primary-foreground"
            tablebodyRowClassName="bg-white hover:bg-secondary/20"
            containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
          />
        )}
      </div>
    </Layout>
  );
}