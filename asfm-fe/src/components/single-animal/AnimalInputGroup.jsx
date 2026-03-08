import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import handleChange from '@/utils/single-animal/handleAnimalForm';

export default function AnimalInputGroup({
  isEditing,
  viewAnimal,
  htmlForLabel,
  labelTitle,
  prop,
  unit,
}) {
  return (
    <div>
      <Label htmlFor={htmlForLabel} className={'pl-2 pb-1'}>
        {labelTitle}
      </Label>
      <div className="relative">
        <Input
          id={htmlForLabel}
          className={`${isEditing ? ' ' : 'focus-visible:border-none focus-visible:ring-0 bg-gray-100 cursor-text'}`}
          readOnly={!isEditing}
          value={viewAnimal[prop] ?? ''}
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
