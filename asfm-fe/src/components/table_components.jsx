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
}) {
  return (
    <div className={containerClassName}>
      <Table>
        <ShadcnTableHeader className={`sticky top-0 z-10 ${headerClassName}`}>
          <ShadcnTableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey} className={column.headClassName}>
                {column.header}
              </TableHead>
            ))}
          </ShadcnTableRow>
        </ShadcnTableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: numberOfRowForSkelton }).map((_, i) => (
                <ShadcnTableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey} className={column.cellClassName}>
                      <Skeleton className="h-4" />
                    </TableCell>
                  ))}
                </ShadcnTableRow>
              ))
            : data.map((row, rowIndex) => (
                <ShadcnTableRow key={rowIndex} className={`${tablebodyRowClassName} `}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey} className={column.cellClassName}>
                      {row[column.accessorKey]}
                    </TableCell>
                  ))}
                </ShadcnTableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
