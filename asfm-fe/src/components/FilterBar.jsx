import { Button } from './ui/button';

export default function FilterBar({
  children,
  onFilter,
  onClear,
  onAddNew,
  addNewButtonLabel = "Add New"
}) {
  const handleFilterSearch = () => {
    onFilter();
  };

  const handleClear = () => {
    if (onClear) onClear();
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
      {children}
      <Button
        onClick={handleFilterSearch}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Filter Search
      </Button>

      <Button
        onClick={handleClear}
        variant="outline"
      >
        Clear
      </Button>

      <Button
        onClick={onAddNew}
        className="ml-auto"
      >
        {addNewButtonLabel}
      </Button>
    </div>
  );
}
