import getBirthdayYear from '@/utils/getBirthday';
import { Card } from '../ui/card';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { PawPrint } from 'lucide-react';
import { Link } from '@tanstack/react-router';

const formatLabel = (value) => {
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function MyAnimalCard({ animal }) {
  const age = getBirthdayYear(animal.dob);
  const ageLabel = age ? `${age} ${age > 1 ? 'yrs' : 'yr'}` : 'Unknown age';
  const speciesLabel = formatLabel(animal.species);
  const sexLabel = formatLabel(animal.sex);
  const imageUrl = animal.picture || 'https://placehold.co/600x600?text=Animal';

  return (
    <Card className="overflow-hidden border-border/80 py-0 gap-0 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
        <img
          src={imageUrl}
          alt={`adoption picture of ${animal.species} ${animal.name}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
          <Badge variant="secondary" className="rounded-full bg-background/90 backdrop-blur">
            {speciesLabel}
          </Badge>
          <div className="flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
            <PawPrint className="size-3.5 text-primary" />
            {animal.chip_id ?? 'No chip ID'}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{animal.name ?? 'Unnamed Animal'}</h2>
              <p className="text-sm text-muted-foreground">
                {sexLabel} · {ageLabel}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full font-medium',
                animal.altered
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600'
                  : 'border-amber-500/30 bg-amber-500/5 text-amber-700'
              )}
            >
              {animal.altered ? 'Fixed' : 'Not Fixed'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AnimalStatPill label="Chip ID" data={animal.chip_id ?? '—'} />
          <AnimalStatPill label="Species" data={speciesLabel} />
          <AnimalStatPill label="Sex" data={sexLabel} />
        </div>

        <div className="flex justify-end">
          <Link
            to="/single-animal/$id"
            params={{ id: animal.id }}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'rounded-full border-primary/20 bg-primary/5 px-5 hover:bg-primary/10'
            )}
          >
            View Profile
          </Link>
        </div>
      </div>
    </Card>
  );
}

function AnimalStatPill({ label, data }) {
  return (
    <div className="rounded-2xl border bg-muted/20 px-4 py-3">
      <span className="block text-muted-foreground text-xs font-medium uppercase tracking-[0.16em]">
        {label}
      </span>
      <span className="mt-1 block text-sm font-medium">{data}</span>
    </div>
  );
}
