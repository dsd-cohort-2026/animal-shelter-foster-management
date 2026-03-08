import * as React from 'react';
import { SlidersHorizontal, X, Clock, Calendar, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from './date-range-picker';
import FilterSelect from '../custom/FilterSelect';
import { MultiSelect } from './multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { LOG_TYPE_OPTIONS } from '@/constants/medicalLogConstants';
import { cn } from '@/lib/utils';

export function UnifiedMedicalLogPopover({
  filters,
  onFiltersChange,
  showCreatedBy = true,
  className,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCustomExpanded, setIsCustomExpanded] = React.useState(true);

  const hasActiveFilters =
    filters.search ||
    filters.dateRange?.from ||
    filters.dateRange?.to ||
    filters.logTypes?.length > 0 ||
    (showCreatedBy && filters.createdBy && filters.createdBy !== 'all');

  const activeFilterCount = [
    !!filters.search,
    !!(filters.dateRange?.from || filters.dateRange?.to),
    filters.logTypes?.length > 0,
    showCreatedBy && filters.createdBy && filters.createdBy !== 'all',
  ].filter(Boolean).length;

  // Presets for quick filtering
  const presets = [
    {
      id: 'today',
      label: 'Today',
      icon: <Clock className="size-3" />,
      apply: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        onFiltersChange({
          ...filters,
          dateRange: { from: today, to: new Date() },
        });
      },
    },
    {
      id: 'week',
      label: 'This Week',
      icon: <Calendar className="size-3" />,
      apply: () => {
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        onFiltersChange({
          ...filters,
          dateRange: { from: weekAgo, to: now },
        });
      },
    },
    {
      id: 'medical-only',
      label: 'Medical Only',
      icon: <Filter className="size-3" />,
      apply: () => {
        onFiltersChange({
          ...filters,
          logTypes: ['MEDICAL'],
        });
      },
    },
    ...(showCreatedBy ? [
      {
        id: 'admin-only',
        label: 'Admin Logs Only',
        icon: <Filter className="size-3" />,
        apply: () => {
          onFiltersChange({
            ...filters,
            createdBy: 'admin',
          });
        },
      },
      {
        id: 'foster-only',
        label: 'Foster Logs Only',
        icon: <Filter className="size-3" />,
        apply: () => {
          onFiltersChange({
            ...filters,
            createdBy: 'foster',
          });
        },
      },
    ] : []),
  ];

  const handleClearAll = () => {
    onFiltersChange({
      search: '',
      dateRange: { from: null, to: null },
      logTypes: [],
      createdBy: 'all',
    });
  };

  const handleRemoveFilter = (filterKey) => {
    if (filterKey === 'search') {
      onFiltersChange({ ...filters, search: '' });
    } else if (filterKey === 'dateRange') {
      onFiltersChange({ ...filters, dateRange: { from: null, to: null } });
    } else if (filterKey === 'logTypes') {
      onFiltersChange({ ...filters, logTypes: [] });
    } else if (filterKey === 'createdBy') {
      onFiltersChange({ ...filters, createdBy: 'all' });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasActiveFilters ? 'default' : 'outline'}
          size="sm"
          className={cn('gap-2 transition-all', className)}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 px-1.5 text-xs font-medium"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start" side="bottom">
        <div className="flex flex-col">
          {/* Header */}
          <div className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Filters</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Active filters bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-1.5 px-4 py-2 bg-muted/30 border-b">
              {filters.search && (
                <FilterChip
                  label={`Search: "${filters.search}"`}
                  onRemove={() => handleRemoveFilter('search')}
                />
              )}
              {(filters.dateRange?.from || filters.dateRange?.to) && (
                <FilterChip
                  label="Date Range"
                  onRemove={() => handleRemoveFilter('dateRange')}
                />
              )}
              {filters.logTypes?.length > 0 && (
                <FilterChip
                  label={`${filters.logTypes.length} types`}
                  onRemove={() => handleRemoveFilter('logTypes')}
                />
              )}
              {showCreatedBy && filters.createdBy && filters.createdBy !== 'all' && (
                <FilterChip
                  label={filters.createdBy === 'admin' ? 'Admin only' : 'Foster only'}
                  onRemove={() => handleRemoveFilter('createdBy')}
                />
              )}
            </div>
          )}

          {/* Quick presets - always visible */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-xs text-muted-foreground">
              Quick presets for common queries
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    preset.apply();
                  }}
                  className="justify-start gap-2 h-9"
                >
                  {preset.icon}
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom filters - collapsible */}
          <div className="border-t">
            <button
              onClick={() => setIsCustomExpanded(!isCustomExpanded)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span>Custom Filters</span>
              {isCustomExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>

            {isCustomExpanded && (
              <div className="px-4 pb-4 space-y-4">
                {/* Date Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Date Range
                  </label>
                  <DateRangePicker
                    value={filters.dateRange}
                    onChange={(range) =>
                      onFiltersChange({ ...filters, dateRange: range })
                    }
                    className="w-full"
                  />
                </div>

                {/* Log Types */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Log Types
                  </label>
                  <MultiSelect
                    options={LOG_TYPE_OPTIONS}
                    value={filters.logTypes}
                    onChange={(types) =>
                      onFiltersChange({ ...filters, logTypes: types })
                    }
                    placeholder="All types"
                    className="w-full"
                  />
                </div>

                {/* Created By */}
                {showCreatedBy && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Created By
                    </label>
                    <FilterSelect
                      value={filters.createdBy}
                      onChange={(value) =>
                        onFiltersChange({ ...filters, createdBy: value })
                      }
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

                {/* Done button */}
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Filter chip component
function FilterChip({ label, onRemove }) {
  return (
    <Badge
      variant="secondary"
      className="h-6 px-2 gap-1 text-xs font-medium pr-1 cursor-pointer hover:bg-secondary/70 transition-colors"
    >
      {label}
      <X
        className="size-3.5 text-muted-foreground hover:text-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
    </Badge>
  );
}