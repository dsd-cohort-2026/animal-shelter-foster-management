import * as React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DateRangePicker({ value = { from: null, to: null }, onChange, className }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const formatDateRange = () => {
    if (!value.from && !value.to) return 'Select date range';
    if (value.from && !value.to) {
      return format(value.from, 'MMM dd, yyyy');
    }
    if (!value.from && value.to) {
      return `Until ${format(value.to, 'MMM dd, yyyy')}`;
    }
    return `${format(value.from, 'MMM dd, yyyy')} - ${format(value.to, 'MMM dd, yyyy')}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value.from && !value.to && 'text-muted-foreground',
            className,
          )}
        >
          <Calendar className="mr-2 size-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="range"
          selected={{
            from: value.from,
            to: value.to,
          }}
          onSelect={onChange}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
