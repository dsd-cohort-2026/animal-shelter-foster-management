# Medical Log Filter Bar Integration Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the vertical Sheet-based MedicalLogFilterDrawer with a horizontal FilterBar component across all three medical log pages (admin, foster, and index), using existing reusable filter components where possible.

**Architecture:** Create specialized filter components (DateRangePicker, MultiSelect) that integrate with the existing FilterBar pattern. Maintain current filter functionality (search, date range, log types, created by) but present it in a horizontal layout with Filter Search, Clear, and Add Log buttons.

**Tech Stack:** React, existing FilterBar/SearchBar/FilterSelect components, react-day-picker (already installed), date-fns (already installed), Tailwind CSS

---

## Task 1: Create DateRangePicker Component

**Objective:** Build a reusable date range picker component that displays selected date range in a button and shows a calendar popover when clicked.

**Files:**
- Create: `asfm-fe/src/components/ui/date-range-picker.jsx`

**Step 1: Write the component**

```jsx
import * as React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DateRangePicker({
  value = { from: null, to: null },
  onChange,
  className,
}) {
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
```

**Step 2: Verify no syntax errors**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
cd asfm-fe
git add src/components/ui/date-range-picker.jsx
git commit -m "feat: add DateRangePicker component for filter bar"
```

---

## Task 2: Create MultiSelect Component

**Objective:** Build a multi-select dropdown component that allows selecting multiple log type options with checkboxes and displays selected count.

**Files:**
- Create: `asfm-fe/src/components/ui/multi-select.jsx`

**Step 1: Write the component**

```jsx
import * as React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
```

**Step 2: Verify no syntax errors**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
cd asfm-fe
git add src/components/ui/multi-select.jsx
git commit -m "feat: add MultiSelect component for log type filtering"
```

---

## Task 3: Create MedicalLogFilterBar Component

**Objective:** Build a specialized filter bar for medical logs that combines FilterBar with SearchBar, DateRangePicker, MultiSelect, and FilterSelect components.

**Files:**
- Create: `asfm-fe/src/components/MedicalLogFilterBar.jsx`

**Step 1: Write the component**

```jsx
import { useState } from 'react';
import FilterBar from './FilterBar';
import SearchBar from './SearchBar';
import { DateRangePicker } from './ui/date-range-picker';
import { MultiSelect } from './ui/multi-select';
import FilterSelect from './custom/FilterSelect';
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

  const handleDateRangeChange = (range) => {
    setTempFilters({
      ...tempFilters,
      dateRange: {
        from: range?.from || null,
        to: range?.to || null,
      },
    });
  };

  const handleLogTypesChange = (types) => {
    setTempFilters({ ...tempFilters, logTypes: types });
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
      <DateRangePicker
        value={tempFilters.dateRange}
        onChange={handleDateRangeChange}
      />
      <MultiSelect
        options={LOG_TYPE_OPTIONS}
        value={tempFilters.logTypes}
        onChange={handleLogTypesChange}
        placeholder="Log types"
      />
      {showCreatedBy && (
        <FilterSelect
          value={tempFilters.createdBy}
          onChange={handleCreatedByChange}
          selectTriggerClassName="w-[180px]"
          selectItems={['all', 'admin', 'foster']}
          selectItemsMap={{
            all: 'All Users',
            admin: 'Admin/Staff',
            foster: 'Foster',
          }}
        />
      )}
    </FilterBar>
  );
}
```

**Step 2: Verify no syntax errors**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
cd asfm-fe
git add src/components/MedicalLogFilterBar.jsx
git commit -m "feat: add MedicalLogFilterBar component with horizontal layout"
```

---

## Task 4: Update FilterSelect to Support Display Map

**Objective:** Enhance FilterSelect component to support a display map for option values.

**Files:**
- Modify: `asfm-fe/src/components/custom/FilterSelect.jsx`

**Step 1: Add selectItemsMap prop**

After line 10, add the prop:

```jsx
export default function FilterSelect({
  value,
  onChange,
  selectClassName,
  selectTriggerClassName,
  selectContentClassName,
  selectItems,
  selectItemsMap, // Add this line
}) {
```

**Step 2: Update the mapping logic**

Replace lines 12-16 with:

```jsx
  const selectItemsMapped = selectItems.map((item, index) => {
    const displayText = selectItemsMap?.[item] || item;
    return (
      <SelectItem key={index} value={item}>
        {displayText}
      </SelectItem>
    );
  });
```

**Step 3: Verify build**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
cd asfm-fe
git add src/components/custom/FilterSelect.jsx
git commit -m "feat: add selectItemsMap prop to FilterSelect for custom display"
```

---

## Task 5: Update Admin Medical Log Page

**Objective:** Replace MedicalLogFilterDrawer with MedicalLogFilterBar in the admin medical logs page.

**Files:**
- Modify: `asfm-fe/src/routes/medical-logs/admin.jsx`

**Step 1: Update imports**

Replace line 21 with:

```jsx
import { MedicalLogFilterBar } from '@/components/MedicalLogFilterBar';
```

**Step 2: Replace filter drawer with filter bar**

Replace lines 230-239 with:

```jsx
          <MedicalLogFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            showCreatedBy={true}
            onAddNew={() => navigate({ to: '/medical-logs/add' })}
            addNewButtonLabel="Add Medical Log"
          />
```

**Step 3: Update result count display**

Replace line 232 with:

```jsx
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filtered.length} of {medicalLogs.length} logs
          </p>
```

**Step 4: Verify build**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 5: Commit**

```bash
cd asfm-fe
git add src/routes/medical-logs/admin.jsx
git commit -m "refactor: replace MedicalLogFilterDrawer with MedicalLogFilterBar in admin page"
```

---

## Task 6: Update Foster Medical Log Page

**Objective:** Replace MedicalLogFilterDrawer with MedicalLogFilterBar in the foster medical logs page.

**Files:**
- Modify: `asfm-fe/src/routes/medical-logs/foster.jsx`

**Step 1: Update imports**

Replace line 12 with:

```jsx
import { MedicalLogFilterBar } from '@/components/MedicalLogFilterBar';
```

**Step 2: Replace filter drawer with filter bar**

Replace lines 196-205 with:

```jsx
          <MedicalLogFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            showCreatedBy={false}
            onAddNew={() => navigate({ to: '/medical-logs/add' })}
            addNewButtonLabel="Add Medical Log"
          />
```

**Step 3: Update result count display**

Replace line 198 with:

```jsx
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filtered.length} of {fosterLogs.length} logs
          </p>
```

**Step 4: Verify build**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 5: Commit**

```bash
cd asfm-fe
git add src/routes/medical-logs/foster.jsx
git commit -m "refactor: replace MedicalLogFilterDrawer with MedicalLogFilterBar in foster page"
```

---

## Task 7: Update Index Medical Log Page

**Objective:** Replace MedicalLogFilterDrawer with MedicalLogFilterBar in the main medical logs list page.

**Files:**
- Modify: `asfm-fe/src/routes/medical-logs/index.jsx`

**Step 1: Update imports**

Replace line 11 with:

```jsx
import { MedicalLogFilterBar } from '@/components/MedicalLogFilterBar';
```

**Step 2: Replace filter drawer with filter bar**

Replace lines 114-123 with:

```jsx
          <MedicalLogFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            showCreatedBy={true}
            onAddNew={() => navigate({ to: '/medical-logs/add' })}
            addNewButtonLabel="Add Log"
          />
```

**Step 3: Update result count display**

Replace line 116 with:

```jsx
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filtered.length} of {medicalLogs.length} logs
          </p>
```

**Step 4: Verify build**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 5: Commit**

```bash
cd asfm-fe
git add src/routes/medical-logs/index.jsx
git commit -m "refactor: replace MedicalLogFilterDrawer with MedicalLogFilterBar in index page"
```

---

## Task 8: Test Integration and Clean Up

**Objective:** Verify the filter bar works correctly across all pages and clean up unused imports.

**Files:**
- Modify: `asfm-fe/src/routes/medical-logs/admin.jsx`
- Modify: `asfm-fe/src/routes/medical-logs/foster.jsx`
- Modify: `asfm-fe/src/routes/medical-logs/index.jsx`

**Step 1: Start dev server**

Run: `cd asfm-fe && npm run dev`
Expected: Dev server starts without errors

**Step 2: Test admin page**

1. Navigate to http://localhost:5173/medical-logs/admin
2. Verify filter bar displays with all four filters
3. Test search filter
4. Test date range picker
5. Test log type multi-select
6. Test created by dropdown
7. Click Filter Search and verify results update
8. Click Clear and verify all filters reset

**Step 3: Test foster page**

1. Navigate to http://localhost:5173/medical-logs/foster
2. Verify filter bar displays without created by dropdown
3. Test all remaining filters
4. Verify filtering works correctly

**Step 4: Test index page**

1. Navigate to http://localhost:5173/medical-logs/
2. Verify filter bar displays with all four filters
3. Test all filters work correctly

**Step 5: Remove unused imports from admin.jsx**

Remove line 20:

```jsx
import { MedicalLogFilterbar } from '@/components/MedicalLogFilterbar';
```

**Step 6: Remove unused imports from foster.jsx**

Remove line 11:

```jsx
import { MedicalLogFilterbar } from '@/components/MedicalLogFilterbar';
```

**Step 7: Remove unused imports from index.jsx**

Remove line 10:

```jsx
import { MedicalLogFilterbar } from '@/components/MedicalLogFilterbar';
```

**Step 8: Final build verification**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 9: Commit**

```bash
cd asfm-fe
git add src/routes/medical-logs/admin.jsx src/routes/medical-logs/foster.jsx src/routes/medical-logs/index.jsx
git commit -m "refactor: clean up unused imports after filter bar integration"
```

---

## Task 9: Optional - Archive MedicalLogFilterDrawer

**Objective:** Remove the old MedicalLogFilterDrawer component if no longer needed.

**Files:**
- Delete: `asfm-fe/src/components/MedicalLogFilterDrawer.jsx`

**Step 1: Verify component is not imported anywhere**

Run: `cd asfm-fe && grep -r "MedicalLogFilterDrawer" src/ --exclude-dir=node_modules`
Expected: No matches found

**Step 2: Delete the file**

Run: `cd asfm-fe && rm src/components/MedicalLogFilterDrawer.jsx`

**Step 3: Verify build**

Run: `cd asfm-fe && npm run build`
Expected: Build succeeds without errors

**Step 4: Commit**

```bash
cd asfm-fe
git rm src/components/MedicalLogFilterDrawer.jsx
git commit -m "refactor: remove unused MedicalLogFilterDrawer component"
```

---

## Verification Summary

After completing all tasks, verify:

1. ✅ All three medical log pages use horizontal FilterBar layout
2. ✅ Search filter works (animal name)
3. ✅ Date range picker works (from/to dates)
4. ✅ Log type multi-select works (Medical, Behavioral, Veterinary)
5. ✅ Created by dropdown works (admin page only)
6. ✅ Filter Search button applies filters
7. ✅ Clear button resets all filters
8. ✅ Add New/Log button navigates to add page
9. ✅ Result count displays correctly
10. ✅ No console errors
11. ✅ Build succeeds without errors
12. ✅ All components follow existing patterns

---

## Component Architecture

```
FilterBar (horizontal container)
├── SearchBar (animal name search)
├── DateRangePicker (from/to date selection)
├── MultiSelect (log type checkboxes)
└── FilterSelect (created by dropdown - admin only)
```

**Props Flow:**
- Parent pages manage `filters` state
- `MedicalLogFilterBar` manages temporary filter state
- Filter Search applies temp filters to parent state
- Clear resets both temp and parent filters

**Component Reuse:**
- FilterBar: existing component from PR #57
- SearchBar: existing component
- FilterSelect: existing component (enhanced with display map)
- DateRangePicker: new component (reuses Calendar, Popover, Button)
- MultiSelect: new component (reuses Select, Checkbox)
- Calendar: existing component from react-day-picker
- Popover: existing component from radix-ui

---

## Next Steps After Implementation

1. Test responsive behavior on mobile devices
2. Consider adding keyboard accessibility improvements
3. Add loading state indicators when filtering large datasets
4. Consider persisting filter state in URL params or local storage
5. Add unit tests for new components if test suite exists