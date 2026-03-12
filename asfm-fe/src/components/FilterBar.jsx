import { Button } from './ui/button';

export default function FilterBar({
  children,
  onClear,
  onAddNew,
  addNewButtonLabel = 'Add New',
  enableAddButton = true,
}) {
  const handleClear = () => {
    if (onClear) onClear();
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
      {children}
      <Button onClick={handleClear} variant="outline">
        Clear
      </Button>

      {enableAddButton && (
        <Button onClick={onAddNew} className="ml-auto">
          {addNewButtonLabel}
        </Button>
      )}
    </div>
  );
}
