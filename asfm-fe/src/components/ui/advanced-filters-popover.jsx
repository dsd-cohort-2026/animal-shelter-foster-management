import * as React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from './date-range-picker';
import FilterSelect from '../custom/FilterSelect';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export function AdvancedFiltersPopover({
  dateRange,
  onDateRangeChange,
  createdBy,
  onCreatedByChange,
  showCreatedBy = true,
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hasActiveFilters =
    dateRange?.from || dateRange?.to || (showCreatedBy && createdBy !== 'all');

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant={hasActiveFilters ? 'default' : 'outline'} size="sm" className="gap-2">
          <SlidersHorizontal className="size-4" />
          Advanced
          {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Date Range</h4>
            <DateRangePicker value={dateRange} onChange={onDateRangeChange} className="w-full" />
          </div>
          {showCreatedBy && (
            <div>
              <h4 className="text-sm font-medium mb-2">Created By</h4>
              <FilterSelect
                value={createdBy}
                onChange={onCreatedByChange}
                selectTriggerClassName="w-full"
                selectItems={['all', 'admin', 'foster']}
                selectItemsMap={{
                  all: 'All Users',
                  admin: 'Admin/Staff',
                  foster: 'Foster',
                }}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
