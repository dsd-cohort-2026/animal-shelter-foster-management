import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { AnimalGeneralInfo } from '@/components/single-animal/AnimalGeneralInfo';
import SingleAnimalMedicalLogs from '@/components/single-animal/SingleAnimalMedicalLogs';
import { fetchAnimal, fetchAnimalMedicalLogs } from '@/services/singleAnimalPageService';
import { useBoundStore } from '@/store';
import { AlertCircle, PawPrint } from 'lucide-react';

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
              An at-a-glance profile for foster care, daily check-ins, and medical history.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="font-medium">
                {animalLogs.length} medical {animalLogs.length === 1 ? 'log' : 'logs'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <article className="space-y-6">
        <AnimalGeneralInfo viewAnimal={viewAnimal} />
        <SingleAnimalMedicalLogs animalLogs={animalLogs} canViewLogs={Boolean(user)} />
      </article>
    </div>
  );
}
