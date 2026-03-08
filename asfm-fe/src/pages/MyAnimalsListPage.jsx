import MyAnimalCard from '@/components/my-animals/MyAnimalCard';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useBoundStore } from '@/store';

export default function MyAnimalsListPage() {
  const user = useBoundStore((state) => state.user);
  const [myAnimals, setMyAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const session = useBoundStore((state) => state.session)
  let token;
  if (session) {
  token = session.access_token;
    console.log(token)
  }


  const url = 'http://localhost:8080/api'; // <-- change url to an env variable once backend deployment url is finalized 

  async function fetchMyAnimals(userId) {
    try {
      const response = await fetch(`${url}/animals`, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch my animals: ${response.status}`);
      } else {
        const data = await response.json();
        setMyAnimals(data);
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user && token) {
      fetchMyAnimals(user.id);
    }
  }, [user, token]);

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
    <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="ring-2 p-5 rounded-lg bg-secondary">
        <h1 className="text-center text-2xl">My Animals</h1>
      </div>
      <div className="mt-10 p-4 ring-2 rounded-lg flex flex-col gap-y-5 min-h-screen bg-secondary">
        {myAnimals.length === 0 ? (
          <div className="flex flex-col  items-center pt-5">
            <h2 className="text-2xl font-semibold">No animals registered</h2>
            <p className="text-lg pt-5">Animals you register will show up here.</p>
          </div>
        ) : (
          <>
            {myAnimals.map((animal, index) => (
              <MyAnimalCard key={index} animal={animal} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
