import { useState } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import MedicalLogCard from '@/components/single-animal/MedicalLogCard';
import { AnimalGeneralInfo } from '@/components/single-animal/AnimalGeneralInfo';
import { fetchAnimal, fetchAnimalMedicalLogs } from '@/services/singleAnimalPageService';

export default function SingleAnimalPage({ id }) {
  const [viewAnimal, setViewAnimal] = useState('');
  const [animalLogs, setAnimalLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      const animalResults = await fetchAnimal(id)
      if (!animalResults) {
        setIsError(true);
        setViewAnimal(null);
        setIsLoading(false)
        return 
      }
      setViewAnimal(animalResults)

      const animalLogsResults = await fetchAnimalMedicalLogs(id)

      if (!animalLogsResults) {
        setAnimalLogs(null)
        setIsLoading(false)
        return 
      }
      setAnimalLogs(animalLogsResults)
      setIsLoading(false)
    }

    load()
  }, [id]);

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
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <article>
          <AnimalGeneralInfo viewAnimal={viewAnimal} />
          <Card className="mt-10">
            <CardTitle className="pl-5">Medical Logs</CardTitle>
            <CardDescription className="px-5 flex flex-col gap-y-5">
              {animalLogs &&
                animalLogs.map((log, index) => <MedicalLogCard key={index} log={log} />)}
            </CardDescription>
          </Card>
        </article>
      </div>
    </>
  );
}
