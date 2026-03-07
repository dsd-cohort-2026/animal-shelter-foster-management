/**
 * FeatureSelector Component
 *
 * A compact multi-select component with pill/badge UI where selected items
 * appear as pills in a horizontal scrollable area with an 'Add +' button
 * that opens a grid-based dropdown.
 *
 * Features:
 * - Selected items displayed as pills in horizontal scrollable area (max 2 rows)
 * - 'Add +' button to open dropdown with available options
 * - Dropdown shows options in 2-3 column grid layout
 * - Grid items as clickable cards/pills with hover effects
 * - Visual distinction for selected items in dropdown (checkmark indicator)
 * - Scrollable selected items area when many items selected
 * - Clear visual feedback, minimal footprint, mobile-friendly
 *
 * @example
 * const [selectedIds, setSelectedIds] = useState(['opt1', 'opt2']);
 * const options = [
 *   { id: 'opt1', name: 'Option 1' },
 *   { id: 'opt2', name: 'Option 2' },
 *   { id: 'opt3', name: 'Option 3' },
 * ];
 *
 * <FeatureSelector
 *   options={options}
 *   selectedIds={selectedIds}
 *   onChange={setSelectedIds}
 *   label="Select Features"
 * />
 */
import * as React from 'react';
import { XIcon, PlusIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const FeatureSelector = React.forwardRef(
  (
    {
      options = [],
      selectedIds = [],
      onChange,
      label,
      className,
      maxRows = 2,
      gridColumns = 3,
      ...props
    },
    ref
  ) => {
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const containerRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const addBtnRef = React.useRef(null);

    // Get selected options
    const selectedOptions = React.useMemo(
      () => options.filter((opt) => selectedIds.includes(opt.id)),
      [options, selectedIds]
    );

    // Get available options (for dropdown - shows all, with visual indication of selected)
    const dropdownOptions = React.useMemo(() => options, [options]);

    // Sync external ref
    React.useImperativeHandle(ref, () => ({
      focus: () => addBtnRef.current?.focus(),
      blur: () => addBtnRef.current?.blur(),
    }));

    // Toggle dropdown
    const toggleDropdown = () => {
      const newState = !showDropdown;
      setShowDropdown(newState);
      setIsDropdownOpen(newState);
    };

    // Close dropdown
    const closeDropdown = () => {
      setShowDropdown(false);
      setIsDropdownOpen(false);
    };

    // Handle clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          closeDropdown();
        }
      };

      if (showDropdown) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [showDropdown]);

    // Handle adding/removing an option
    const handleToggleOption = (optionId) => {
      if (selectedIds.includes(optionId)) {
        // Remove
        const newSelectedIds = selectedIds.filter((id) => id !== optionId);
        onChange(newSelectedIds);
      } else {
        // Add
        const newSelectedIds = [...selectedIds, optionId];
        onChange(newSelectedIds);
      }
    };

    // Handle removing a pill directly
    const handleRemovePill = (optionId, event) => {
      event.stopPropagation();
      const newSelectedIds = selectedIds.filter((id) => id !== optionId);
      onChange(newSelectedIds);
    };

    // Handle dropdown option click
    const handleDropdownOptionClick = (optionId) => {
      handleToggleOption(optionId);
      // Keep dropdown open for multiple selections
    };

    return (
      <div className={cn('w-full', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium mb-2" id="feature-selector-label">
            {label}
          </label>
        )}

        {/* Selected pills container */}
        <div
          ref={containerRef}
          className={cn(
            'relative flex flex-wrap items-center gap-2 p-2',
            'border rounded-md bg-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:border-ring',
            'min-h-[44px]'
          )}
          style={{
            maxHeight: `${maxRows * 44}px`,
            overflowY: selectedOptions.length > 0 ? 'auto' : 'visible',
          }}
        >
          {/* Selected pills */}
          {selectedOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'bg-primary text-primary-foreground text-sm font-medium',
                'border border-primary/50 shadow-sm',
                'transition-all duration-200',
                'hover:bg-primary/90 active:scale-95'
              )}
            >
              <span className="truncate max-w-[150px]">{option.name || option.label}</span>
              <button
                type="button"
                className="rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 p-0.5"
                onClick={(e) => handleRemovePill(option.id, e)}
                aria-label={`Remove ${option.name || option.label}`}
              >
                <XIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Add button */}
          <button
            ref={addBtnRef}
            type="button"
            onClick={toggleDropdown}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium',
              'border border-muted-foreground/20 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              'active:scale-95'
            )}
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Dropdown with grid layout */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/20"
              onClick={closeDropdown}
              aria-hidden="true"
            />

            {/* Dropdown content */}
            <div
              ref={dropdownRef}
              className={cn(
                'absolute z-50 w-full mt-1 p-3',
                'border rounded-md bg-background shadow-lg',
                'animate-in fade-in zoom-in-95 duration-200'
              )}
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
              }}
            >
              {/* Grid of options */}
              <div
                className={cn(
                  'grid gap-2',
                  gridColumns === 2 && 'grid-cols-2',
                  gridColumns === 3 && 'grid-cols-3',
                  gridColumns === 4 && 'grid-cols-4',
                  !gridColumns || gridColumns === 1 && 'grid-cols-1'
                )}
              >
                {dropdownOptions.map((option) => {
                  const isSelected = selectedIds.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleDropdownOptionClick(option.id)}
                      className={cn(
                        'relative flex items-center justify-between gap-2',
                        'px-3 py-2.5 rounded-md text-sm text-left',
                        'transition-all duration-200',
                        'active:scale-[0.98]',
                        isSelected
                          ? 'bg-primary/10 border border-primary/30 text-primary'
                          : 'bg-muted/50 hover:bg-muted border border-transparent hover:border-border',
                        'focus:outline-none focus:ring-2 focus:ring-ring'
                      )}
                    >
                      <span className="truncate font-medium">
                        {option.name || option.label}
                      </span>
                      {isSelected && (
                        <CheckIcon className="h-4 w-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* No options message */}
              {dropdownOptions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No options available
                </div>
              )}
            </div>
          </>
        )}

        {/* Helper text */}
        {selectedIds.length === 0 && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Click 'Add' to select options
          </p>
        )}
      </div>
    );
  }
);

FeatureSelector.displayName = 'FeatureSelector';

export { FeatureSelector };