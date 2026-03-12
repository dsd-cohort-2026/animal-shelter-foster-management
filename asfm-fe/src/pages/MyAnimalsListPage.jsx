import MyAnimalCard from '@/components/my-animals/MyAnimalCard';
import { useCallback, useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useBoundStore } from '@/store';
import apiClient from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PawPrint } from 'lucide-react';

export default function MyAnimalsListPage() {
  const user = useBoundStore((state) => state.user);
  const [myAnimals, setMyAnimals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  console.log('User profile:', userProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const session = useBoundStore((state) => state.session);
  let token;

  if (session) {
    token = session.access_token;
  }

  const fetchMyAnimals = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const [animalsResponse, userResponse] = await Promise.all([
        apiClient.get('/animals'),
        apiClient.get(`/users/${user.id}`),
      ]);

      setMyAnimals(animalsResponse.data);
      setUserProfile(userResponse.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && token) {
      fetchMyAnimals();
    }
  }, [fetchMyAnimals, user?.id, token]);

  const userDisplayName =
    [userProfile?.first_name, userProfile?.last_name].filter(Boolean).join(' ') ||
    user?.email ||
    'your profile';

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
          <PawPrint className="size-7 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Unable to load your animals</h2>
          <p className="text-muted-foreground">Please try again in a moment.</p>
        </div>
        <Button onClick={fetchMyAnimals} variant="outline">
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
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My Animals
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Hello {userDisplayName}, these are the animals currently assigned to your foster care.
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant="secondary" className="font-medium">
                {myAnimals.length} assigned
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {myAnimals.length === 0 ? (
        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/30 mb-4">
              <PawPrint className="size-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">No animals assigned yet</h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              When animals are assigned to your foster profile, they will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {myAnimals.map((animal) => (
            <MyAnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
}
