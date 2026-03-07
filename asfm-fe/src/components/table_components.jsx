import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export function ReusableTable({
  columns,
  data,
  headerClassName = '',
  tablebodyRowClassName = '',
  containerClassName = '',
  isLoading,
  numberOfRowForSkelton = 10,
  enablePagination = false,
  enableColumnVisibility = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  defaultVisibleColumns = null,
  initialSort = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Helper function to get column key (supports both accessorKey and id)
  const getColumnKey = (col) => col.accessorKey || col.id;

  // Initialize sortConfig with initialSort if provided
  const initialSortConfig = initialSort ? {
    key: initialSort.key,
    direction: initialSort.direction,
    columnIndex: columns.findIndex(col => getColumnKey(col) === initialSort.key)
  } : { key: null, direction: 'asc' };

  const [sortConfig, setSortConfig] = useState(initialSortConfig);

  // Initialize with defaultVisibleColumns if provided, otherwise all columns
  const [visibleColumns, setVisibleColumns] = useState(() => {
    if (defaultVisibleColumns && defaultVisibleColumns.length > 0) {
      // Ensure all default columns exist in the actual columns
      return defaultVisibleColumns.filter(colKey =>
        columns.some(col => getColumnKey(col) === colKey)
      );
    }
    return columns.map(col => getColumnKey(col));
  });

  // Update visible columns when columns prop changes
  useEffect(() => {
    if (defaultVisibleColumns && defaultVisibleColumns.length > 0) {
      setVisibleColumns(defaultVisibleColumns.filter(colKey =>
        columns.some(col => getColumnKey(col) === colKey)
      ));
    } else {
      setVisibleColumns(columns.map(col => getColumnKey(col)));
    }
  }, [columns, defaultVisibleColumns]);

  // Reset to page 1 when data or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Filter columns based on visibility
  const visibleColumnDefs = columns.filter(col =>
    visibleColumns.includes(getColumnKey(col))
  );

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.columnIndex) return data;

    const column = visibleColumnDefs[sortConfig.columnIndex];
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      // Handle undefined/null values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Custom sort function if provided
      if (column.sortFunction) {
        const result = column.sortFunction(aVal, bVal, a, b);
        return sortConfig.direction === 'asc' ? result : -result;
      }

      // Default string/number comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortConfig, visibleColumnDefs]);

  // Calculate pagination
  const totalPages = enablePagination
    ? Math.ceil(sortedData.length / itemsPerPage)
    : 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = enablePagination
    ? sortedData.slice(startIndex, endIndex)
    : sortedData;

  // Handle column visibility toggle
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => {
      const newVisible = prev.includes(columnKey)
        ? prev.filter(k => k !== columnKey)
        : [...prev, columnKey];

      // Ensure at least one column remains visible
      if (newVisible.length === 0) {
        return prev;
      }
      return newVisible;
    });
  };

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle sort
  const handleSort = (accessorKey, columnIndex) => {
    setSortConfig((prev) => {
      if (prev.key === accessorKey) {
        // Toggle direction if same column
        return {
          key: prev.direction === 'asc' ? null : accessorKey,
          direction: prev.direction === 'asc' ? 'asc' : 'desc',
          columnIndex: prev.direction === 'asc' ? null : columnIndex,
        };
      }
      // New column, set to asc
      return { key: accessorKey, direction: 'asc', columnIndex };
    });
  };

  return (
    <div className={`flex flex-col overflow-auto flex-1 ${containerClassName}`}>
      {/* Table */}
      <div>
        <Table>
          <ShadcnTableHeader className={`relative sticky top-0 z-10 ${headerClassName}`}>
            <ShadcnTableRow>
              {visibleColumnDefs.map((column, index) => {
                const columnKey = getColumnKey(column);
                const isSortable = column.sortable !== false;
                const isActive = sortConfig.key === columnKey;
                const indicator = isActive ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : '';

                return (
                  <TableHead key={columnKey} className={column.headClassName}>
                    {isSortable ? (
                      <button
                        onClick={() => handleSort(columnKey, index)}
                        className="flex items-center gap-1 hover:text-gray-700 font-medium text-left w-full"
                        type="button"
                      >
                        {column.header}
                        {indicator && (
                          <span className="text-xs text-primary">{indicator}</span>
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </ShadcnTableRow>
            {enableColumnVisibility && (
              <div className="absolute top-2 right-2 z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columns.map((column) => {
                      const columnKey = getColumnKey(column);
                      return (
                        <DropdownMenuCheckboxItem
                          key={columnKey}
                          checked={visibleColumns.includes(columnKey)}
                          onCheckedChange={() => toggleColumn(columnKey)}
                          disabled={visibleColumns.length === 1 && visibleColumns.includes(columnKey)}
                      >
                        {column.header}
                      </DropdownMenuCheckboxItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </ShadcnTableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: numberOfRowForSkelton }).map((_, i) => (
                  <ShadcnTableRow key={i}>
                    {visibleColumnDefs.map((column) => (
                      <TableCell key={getColumnKey(column)} className={column.cellClassName}>
                        <Skeleton className="h-4" />
                      </TableCell>
                    ))}
                  </ShadcnTableRow>
                ))
              : paginatedData.map((row, rowIndex) => (
                  <ShadcnTableRow key={rowIndex} className={`${tablebodyRowClassName}`}>
                    {visibleColumnDefs.map((column) => {
                      const columnKey = getColumnKey(column);
                      return (
                        <TableCell key={columnKey} className={column.cellClassName}>
                          {column.cell ? column.cell({ row: { original: row } }) : (column.accessorKey ? row[column.accessorKey] : null)}
                        </TableCell>
                      );
                    })}
                  </ShadcnTableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {enablePagination && !isLoading && sortedData.length > 0 && (
        <div className="flex items-center justify-between px-2 py-3 border-t bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Showing</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              of {sortedData.length} entries
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium px-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && data.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}
