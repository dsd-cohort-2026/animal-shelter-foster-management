'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DatePickerSimple({ fieldLabelName, className }) {
  const [date, setDate] = React.useState();

  return (
    <Field className={cn('mx-auto', className)}>
      <FieldLabel htmlFor="date-picker-simple">{fieldLabelName}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" id="date-picker-simple" className="justify-start font-normal">
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
