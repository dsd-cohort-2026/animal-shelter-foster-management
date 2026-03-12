import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnimalInputGroup from './AnimalInputGroup';
import { HeartPulse, PawPrint } from 'lucide-react';

const formatLabel = (value) => {
  if (!value) return 'Unknown';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export function AnimalGeneralInfo({ isEditing, viewAnimal }) {
  const imageUrl = viewAnimal?.picture || 'https://placehold.co/1200x900?text=Animal';
  const speciesLabel = formatLabel(viewAnimal?.species);
  const chipId = viewAnimal?.chip_id ?? 'No chip ID';

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-xl">
            <HeartPulse className="size-5 text-primary" />
            General Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
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

      <Card className="overflow-hidden border-border/80 py-0 gap-0 shadow-sm">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20">
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
