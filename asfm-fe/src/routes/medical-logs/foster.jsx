import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import BasicNavBar from '@/components/basicNavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomBadge from '@/components/custom/CustomBadge';
import RoleGuard from '@/components/RoleGuard';
import { useBoundStore } from '@/store';
import { LOG_TYPE_OPTIONS, LOG_TYPE_COLORS, formatLogType } from '@/constants/medicalLogConstants';

export const Route = createFileRoute('/medical-logs/foster')({
  component: FosterLogsPage,
});

function FosterLogsPage() {
  const medicalLogs = useBoundStore((state) => state.medicalLogs);
  const medicalLogsLoading = useBoundStore((state) => state.medicalLogsLoading);
  const medicalLogsError = useBoundStore((state) => state.medicalLogsError);
  const fetchMedicalLogs = useBoundStore((state) => state.fetchMedicalLogs);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchMedicalLogs();
  }, [fetchMedicalLogs]);

  // Only show logs that have a foster_user_id (foster-permitted)
  const filtered = useMemo(() => {
    return medicalLogs
      .filter((log) => {
        if (!log.foster_user_id) return false;
        const matchesSearch = log.animal_name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
  }, [medicalLogs, search, categoryFilter]);

  if (medicalLogsError) {
    return (
      <Layout navBar={<BasicNavBar />}>
        <RoleGuard allowedRoles={['USER']}>
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
    <Layout navBar={<BasicNavBar />}>
      <RoleGuard allowedRoles={['USER']}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Foster Logs</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Medical log entries for your fostered animals.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search by animal name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-60"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Log Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {LOG_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {medicalLogsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
              No foster medical logs found.
            </p>
          ) : (
            <div className="relative space-y-4">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />

              {filtered.map((log) => (
                <Card key={log.id} className="sm:ml-10 relative">
                  <div className="absolute -left-10 top-5 size-3 rounded-full bg-primary border-2 border-background hidden sm:block" />
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CustomBadge
                        text={formatLogType(log.category)}
                        badgeClassName={LOG_TYPE_COLORS[log.category]}
                      />
                      <span className="text-sm font-semibold">{log.animal_name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(log.logged_at).toLocaleDateString()} {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </RoleGuard>
    </Layout>
  );
}
