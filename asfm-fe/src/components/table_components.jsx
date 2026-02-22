import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";

export function ReusableTable({ columns , data , headerClassName="" , tablebodyRowClassName="" , containerClassName=""}) {
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
            {data.map((row, rowIndex) => (
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
  </ div>
  );
};
