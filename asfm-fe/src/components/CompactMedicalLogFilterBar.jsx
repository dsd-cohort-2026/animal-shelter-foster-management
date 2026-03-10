import { CompactFilterBar } from './CompactFilterBar';
import { UnifiedMedicalLogPopover } from './ui/unified-medical-log-popover';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

export function CompactMedicalLogFilterBar({
  filters,
  onFiltersChange,
  onAddNew,
  addNewButtonLabel = 'Add Log',
  className,
  showCreatedBy = true,
  showAddNew = true,
}) {
  const handleClear = () => {
    onFiltersChange({
      search: '',
      dateRange: { from: null, to: null },
      logTypes: [],
      createdBy: 'all',
    });
  };

  return (
    <CompactFilterBar
      onClear={handleClear}
      onAddNew={onAddNew}
      addNewButtonLabel={addNewButtonLabel}
      showAddNew={showAddNew}
      className={className}
    >
      {/* Search input - takes available horizontal space */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search by animal name"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-8 h-8 text-sm w-full"
        />
      </div>
      <UnifiedMedicalLogPopover
        filters={filters}
        onFiltersChange={onFiltersChange}
        showCreatedBy={showCreatedBy}
      />
    </CompactFilterBar>
  );
}
