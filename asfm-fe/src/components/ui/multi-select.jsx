import * as React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options',
  className,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const selectedCount = value.length;
  const displayValue =
    selectedCount > 0
      ? `${selectedCount} type${selectedCount !== 1 ? 's' : ''} selected`
      : placeholder;

  return (
    <Select open={isOpen} onOpenChange={setIsOpen}>
      <SelectTrigger className={cn('w-[280px]', className)}>
        <SelectValue placeholder={displayValue} />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            onSelect={(e) => {
              e.preventDefault();
              handleToggle(option.value);
            }}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={value.includes(option.value)}
              onChange={() => handleToggle(option.value)}
              className="pointer-events-none"
            />
            <span className="flex-1">{option.label}</span>
            {value.includes(option.value) && (
              <Check className="size-4 text-primary" />
            )}
          </SelectItem>
        ))}
        {value.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="w-full text-xs"
            >
              <X className="size-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </SelectContent>
    </Select>
  );
}