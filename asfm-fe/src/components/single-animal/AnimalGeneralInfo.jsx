import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimalInputGroup from './AnimalInputGroup';
import { HeartPulse, PawPrint, Sparkles } from 'lucide-react';

const formatLabel = (value) => {
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const funFactsBySpecies = {
  cat: [
    { label: 'Favorite Toy', value: 'Feather wand' },
    { label: 'Snack Pick', value: 'Crunchy salmon treats' },
    { label: 'Nap Spot', value: 'Sunny window perch' },
  ],
  dog: [
    { label: 'Favorite Toy', value: 'Squeaky tennis ball' },
    { label: 'Snack Pick', value: 'Peanut butter biscuit' },
    { label: 'Nap Spot', value: 'Blanket by the couch' },
  ],
};

export function AnimalGeneralInfo({ isEditing, viewAnimal }) {
  const imageUrl = viewAnimal?.picture || 'https://placehold.co/1200x900?text=Animal';
  const speciesLabel = formatLabel(viewAnimal?.species);
  const chipId = viewAnimal?.chip_id ?? 'No chip ID';
  const funFacts =
    funFactsBySpecies[String(viewAnimal?.species || '').toLowerCase()] ?? [
      { label: 'Favorite Toy', value: 'Soft plush toy' },
      { label: 'Snack Pick', value: 'Training treats' },
      { label: 'Nap Spot', value: 'Quiet cozy corner' },
    ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartPulse className="size-[18px] text-primary" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
              <AnimalInputGroup
                isEditing={isEditing}
                viewAnimal={viewAnimal}
                htmlForLabel="species"
                labelTitle="Species"
                prop="species"
              />
              <AnimalInputGroup
                isEditing={isEditing}
                viewAnimal={viewAnimal}
                htmlForLabel="sex"
                labelTitle="Sex"
                prop="sex"
              />
              <AnimalInputGroup
                isEditing={isEditing}
                viewAnimal={viewAnimal}
                htmlForLabel="fixed-status"
                labelTitle="Fixed Status"
                prop="altered"
              />
              <AnimalInputGroup
                isEditing={isEditing}
                viewAnimal={viewAnimal}
                htmlForLabel="age"
                labelTitle="Age"
                prop="age"
                unit="yrs"
              />
              <AnimalInputGroup
                isEditing={isEditing}
                viewAnimal={viewAnimal}
                htmlForLabel="weight"
                labelTitle="Weight"
                prop="weight"
                unit="lbs"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="size-[18px] text-primary" />
              Personality & Favorites
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="grid gap-2.5 md:grid-cols-3 xl:grid-cols-1">
              {funFacts.map((fact) => (
                <FunFact key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/80 py-0 gap-0 shadow-sm">
        <div className="relative h-full min-h-full overflow-hidden bg-secondary/20">
          <img
            src={imageUrl}
            alt={`${viewAnimal?.name ?? 'Animal'} profile`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4">
            <Badge variant="secondary" className="rounded-full bg-background/90 backdrop-blur">
              {speciesLabel}
            </Badge>
            <div className="flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
              <PawPrint className="size-3.5 text-primary" />
              {chipId}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function FunFact({ label, value }) {
  return (
    <div className="rounded-xl border bg-muted/20 px-4 py-2.5">
      <span className="block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block text-sm font-medium">{value}</span>
    </div>
  );
}
