import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import MedicalLogCard from '@/components/single-animal/MedicalLogCard';
import { AnimalGeneralInfo } from '@/components/single-animal/AnimalGeneralInfo';
import { fetchAnimal, fetchAnimalMedicalLogs } from '@/services/singleAnimalPageService';
import { useBoundStore } from '@/store';
import { PawPrint } from 'lucide-react';

export default function SingleAnimalPage({ id }) {
  const [viewAnimal, setViewAnimal] = useState('');
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
      const animalResults = await fetchAnimal(id);
      if (!animalResults) {
        setIsError(true);
        setViewAnimal(null);
        setIsLoading(false);
        return;
      }
      setViewAnimal(animalResults);

      let animalLogsResults;
      if (token) {
        animalLogsResults = await fetchAnimalMedicalLogs();

        if (animalLogsResults) {
          const filteredLogs = animalLogsResults.filter((log) => log.animal_id === id);
          setAnimalLogs(filteredLogs);
        } else {
          setAnimalLogs(null)
        }
      }
      setIsLoading(false);
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
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
        <p className="text-lg text-gray-700">That animal doesn't seem to be available right now.</p>
        <p className="mt-2 text-gray-500">Please try searching again or check back later.</p>
      </div>
    );
  }
  return (
    <>
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <PawPrint className="size-6 sm:size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {viewAnimal.name}
            </h1>
          </div>
        </div>
      </div>
        <article>
          <AnimalGeneralInfo viewAnimal={viewAnimal} />
          <Card className="mt-10">
            <CardTitle className="pl-5">Medical Logs</CardTitle>
            <CardDescription className="px-5 flex flex-col gap-y-5">
              {!user ? (
                <div>Medical records are only available for foster user owners.</div>
              ) : animalLogs?.length > 0 ? (
                animalLogs.map((log, index) => <MedicalLogCard key={index} log={log} />)
              ) : (
                <div>There are no recorded medical logs for this animal.</div>
              )}
            </CardDescription>
          </Card>
        </article>
      </div>
    </>
  );
}

