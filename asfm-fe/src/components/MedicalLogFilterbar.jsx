import { useState, useEffect } from 'react';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import { MultiSelect } from './ui/multi-select';
import { AdvancedFiltersPopover } from './ui/advanced-filters-popover';
import { LOG_TYPE_OPTIONS } from '@/constants/medicalLogConstants';

export function MedicalLogFilterBar({
  filters,
  onFiltersChange,
  showCreatedBy = true,
  onAddNew,
  addNewButtonLabel = 'Add Medical Log',
  className,
}) {
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleFilter = () => {
    onFiltersChange(tempFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      dateRange: { from: null, to: null },
      logTypes: [],
      createdBy: showCreatedBy ? 'all' : 'foster',
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleSearchChange = (value) => {
    setTempFilters({ ...tempFilters, search: value });
  };

  const handleLogTypesChange = (types) => {
    setTempFilters({ ...tempFilters, logTypes: types });
  };

  const handleDateRangeChange = (range) => {
    setTempFilters({
      ...tempFilters,
      dateRange: {
        from: range?.from || null,
        to: range?.to || null,
      },
    });
  };

  const handleCreatedByChange = (value) => {
    setTempFilters({ ...tempFilters, createdBy: value });
  };

  return (
    <FilterBar
      onFilter={handleFilter}
      onClear={handleClear}
      onAddNew={onAddNew}
      addNewButtonLabel={addNewButtonLabel}
      className={className}
    >
      <SearchBar
        value={tempFilters.search}
        onChange={handleSearchChange}
        placeholder="Search by animal name"
      />
      <MultiSelect
        options={LOG_TYPE_OPTIONS}
        value={tempFilters.logTypes}
        onChange={handleLogTypesChange}
        placeholder="Log types"
      />
      <AdvancedFiltersPopover
        dateRange={tempFilters.dateRange}
        onDateRangeChange={handleDateRangeChange}
        createdBy={tempFilters.createdBy}
        onCreatedByChange={handleCreatedByChange}
        showCreatedBy={showCreatedBy}
      />
    </FilterBar>
  );
}

export { MedicalLogFilterBar as MedicalLogFilterbar };