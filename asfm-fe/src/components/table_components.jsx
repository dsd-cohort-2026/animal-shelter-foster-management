import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";

export function ReusableTable({ columns , data , headerClassName="" }) {
  return (
    <div className="overflow-hidden rounded-lg border  border-pale-sky shadow-sm">
      <Table>
        <ShadcnTableHeader className={headerClassName}>
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
              <ShadcnTableRow key={rowIndex}>
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
};
