import { Button } from './ui/button';
import { X, RotateCcw } from 'lucide-react';

export function CompactFilterBar({
  children,
  onClear,
  onAddNew,
  addNewButtonLabel = 'Add New',
  className,
  showAddNew = true,
  showClear = true,
}) {
  const handleClear = () => {
    if (onClear) onClear();
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 p-2.5 bg-white border border-gray-200 rounded-lg">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-1 min-w-0">{children}</div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {showClear && (
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5 mr-1" />
              Reset
            </Button>
          )}
          {showAddNew && (
            <Button onClick={onAddNew} size="sm" className="h-8 px-3 text-xs">
              {addNewButtonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
