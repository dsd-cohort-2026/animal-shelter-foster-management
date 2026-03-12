import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import MedicalLogCard from '@/components/single-animal/MedicalLogCard';
import { AnimalGeneralInfo } from '@/components/single-animal/AnimalGeneralInfo';
import { fetchAnimal, fetchAnimalMedicalLogs } from '@/services/singleAnimalPageService';
import { useBoundStore } from '@/store';
import { AlertCircle, ClipboardList, PawPrint } from 'lucide-react';

const formatLabel = (value) => {
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function SingleAnimalPage({ id }) {
  const [viewAnimal, setViewAnimal] = useState(null);
  const [animalLogs, setAnimalLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const user = useBoundStore((state) => state.user);
  const session = useBoundStore((state) => state.session);

  let token;
  if (session) {
    token = session.access_token;
  }

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setIsError(false);

      try {
        const animalResults = await fetchAnimal(id);
        if (!animalResults) {
          setIsError(true);
          setViewAnimal(null);
          setAnimalLogs([]);
          return;
        }

        setViewAnimal(animalResults);

        if (token) {
          const animalLogsResults = await fetchAnimalMedicalLogs();
          const filteredLogs = animalLogsResults?.filter((log) => log.animal_id === id) ?? [];
          setAnimalLogs(filteredLogs);
        } else {
          setAnimalLogs([]);
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
        setViewAnimal(null);
        setAnimalLogs([]);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [id, session, token]);

  if (isLoading)
    return (
      <div className="flex justify-center pt-10">
        <Spinner className="size-12 text-primary" />
      </div>
    );

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
        <div className="flex items-center justify-center size-14 rounded-xl bg-secondary/30">
          <AlertCircle className="size-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Unable to load this animal</h2>
          <p className="text-muted-foreground">
            That profile is not available right now. Please try again in a moment.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const speciesLabel = formatLabel(viewAnimal?.species);
  const sexLabel = formatLabel(viewAnimal?.sex);
  const fixedLabel = viewAnimal?.altered ?? 'Unknown';

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <PawPrint className="size-6 sm:size-7 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {viewAnimal?.name ?? 'Animal Profile'}
            </h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              A detailed profile for foster care reference, daily check-ins, and medical history.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="font-medium">
                {speciesLabel}
              </Badge>
              <Badge variant="secondary" className="font-medium">
                {sexLabel}
              </Badge>
              <Badge variant="outline" className="font-medium">
                {fixedLabel}
              </Badge>
              <Badge variant="outline" className="font-medium">
                {animalLogs.length} medical {animalLogs.length === 1 ? 'log' : 'logs'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <article className="space-y-6">
        <AnimalGeneralInfo viewAnimal={viewAnimal} />

        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="size-5 text-primary" />
              Medical Logs
            </CardTitle>
            <CardDescription>
              Review recent entries, medications, and notes for this animal.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!user ? (
              <div className="rounded-xl border border-dashed bg-muted/10 px-4 py-8 text-center text-sm text-muted-foreground">
                Medical records are only available to foster users assigned to this animal.
              </div>
            ) : animalLogs.length > 0 ? (
              <div className="space-y-4">
                {animalLogs.map((log) => (
                  <MedicalLogCard key={log.id ?? `${log.animal_id}-${log.logged_at}`} log={log} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-muted/10 px-4 py-10 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-secondary/30">
                  <ClipboardList className="size-5 text-primary" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">No medical logs yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Entries will appear here once care notes and treatments have been recorded.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
