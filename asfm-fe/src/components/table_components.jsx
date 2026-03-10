import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

export function ReusableTable({
  columns,
  data,
  headerClassName = '',
  tablebodyRowClassName = '',
  containerClassName = '',
  isLoading,
  numberOfRowForSkelton = 10,
  initialSort = null,
}) {
  const [sortConfig, setSortConfig] = useState(initialSort || { key: null, direction: 'asc' })

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [data, sortConfig])

  return (
    <div className={containerClassName}>
      <Table>
        <ShadcnTableHeader className={`sticky top-0 z-10 ${headerClassName}`}>
          <ShadcnTableRow>
            {columns.map((column) => {
              const isActive = sortConfig.key === column.accessorKey
              const indicator = isActive ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''
              return (
                <TableHead key={column.accessorKey || column.id} className={column.headClassName}>
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.accessorKey)}
                      className="flex items-center gap-1 hover:text-gray-700 font-medium"
                    >
                      {column.header}{indicator}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              )
            })}
          </ShadcnTableRow>
        </ShadcnTableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: numberOfRowForSkelton }).map((_, i) => (
                <ShadcnTableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey || column.id} className={column.cellClassName}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </ShadcnTableRow>
              ))
            : sortedData.map((row, rowIndex) => (
                <ShadcnTableRow key={rowIndex} className={`${tablebodyRowClassName} `}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey || column.id} className={column.cellClassName}>
                      {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
                    </TableCell>
                  ))}
                </ShadcnTableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
