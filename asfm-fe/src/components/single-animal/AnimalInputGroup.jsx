import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function AnimalInputGroup({
  isEditing,
  viewAnimal,
  htmlForLabel,
  labelTitle,
  prop,
  unit,
}) {
  const rawValue = viewAnimal[prop];
  const displayValue = rawValue || rawValue === 0 ? `${rawValue}${unit ? ` ${unit}` : ''}` : 'Unknown';

  if (!isEditing) {
    return (
      <div className="rounded-2xl border bg-background px-4 py-4 shadow-sm">
        <span className="block text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {labelTitle}
        </span>
        <span className="mt-2 block text-base font-semibold text-foreground">{displayValue}</span>
      </div>
    );
  }

  return (
    <div>
      <Label htmlFor={htmlForLabel} className={'pl-2 pb-1'}>
        {labelTitle}
      </Label>
      <div className="relative">
        <Input
          id={htmlForLabel}
          className="bg-background"
          readOnly={!isEditing}
          value={rawValue ?? ''}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
