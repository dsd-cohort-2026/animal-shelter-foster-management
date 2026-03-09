import * as React from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options',
  className,
  showChips = true,
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn('w-[280px] justify-between', className)}>
          <span className="truncate">{displayValue}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="max-h-80 overflow-auto p-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              )}
            >
              <Checkbox
                checked={value.includes(option.value)}
                onChange={() => handleToggle(option.value)}
                className="pointer-events-none"
              />
              <span className="flex-1 text-left">{option.label}</span>
              {value.includes(option.value)}
            </button>
          ))}
        </div>
        {showChips && value.length > 0 && (
          <div className="p-2 border-t bg-muted/30">
            <div className="flex gap-1 mb-2 flex-wrap">
              {value.map((v) => {
                const label = options.find((o) => o.value === v)?.label;
                return (
                  <span
                    key={v}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                  >
                    {label}
                    <button
                      onClick={() => handleToggle(v)}
                      className="ml-1 hover:text-primary-foreground/80"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              className="w-full text-xs h-7"
            >
              <X className="size-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
