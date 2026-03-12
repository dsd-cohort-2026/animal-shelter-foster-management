import { createFileRoute } from '@tanstack/react-router';
import { ReusableTable } from '../../components/table_components';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';
import { useBoundStore } from '@/store';
import apiClient from '@/lib/axios';
import { Spinner } from '@/components/ui/spinner';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const Route = createFileRoute('/_user/my-supplies')({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useBoundStore((state) => state.user);
  const session = useBoundStore((state) => state.session);
  const token = session?.access_token;

  const [supplies, setSupplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function fetchSupplies() {
    try {
      const response = await apiClient.get('/inventory-transactions');
      setSupplies(response.data);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user && token) {
      fetchSupplies();
    }
  }, [user, token]);

  const suppliesColumns = [
    {
      accessorKey: 'created_at',
      header: 'Loaned At',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[130px]',
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: 'item',
      id: 'itemBrand',
      header: 'Brand',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[150px]',
      cell: ({ row }) => row.original.item?.brand ?? '—',
    },
    {
      accessorKey: 'item',
      id: 'itemName',
      header: 'Item Name',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[200px]',
      cell: ({ row }) => row.original.item?.name ?? '—',
    },
    {
      accessorKey: 'item',
      id: 'itemDescription',
      header: 'Description',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[200px]',
      cell: ({ row }) => row.original.item?.description ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Loan Status',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
  ];

  const fosterName = supplies[0]?.foster_user
    ? `${supplies[0].foster_user.first_name} ${supplies[0].foster_user.last_name}`
    : user?.email ?? '';

  const activeCount = supplies.filter((s) => s.status === 'ACTIVE').length;
  const completeCount = supplies.filter((s) => s.status === 'COMPLETE').length;

  if (isLoading) {
    return (
      <div className="flex justify-center pt-10">
        <Spinner className="size-12 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h2 className="text-2xl font-semibold mb-4">Oops!</h2>
        <p className="text-lg text-gray-700">Your supplies could not be loaded right now.</p>
        <p className="mt-2 text-gray-500">Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <ShoppingBag className="size-6 sm:size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              My Supplies
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {fosterName} — supplies assigned to your foster animals.
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant="secondary" className="font-medium">
                {supplies.length} total
              </Badge>
              {activeCount > 0 && (
                <Badge
                  variant="outline"
                  className="font-medium border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                >
                  {activeCount} active
                </Badge>
              )}
              {completeCount > 0 && (
                <Badge
                  variant="outline"
                  className="font-medium border-blue-500/30 text-blue-600 bg-blue-500/5"
                >
                  {completeCount} complete
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {supplies.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">
          No supplies currently assigned to you.
        </div>
      )}
      <ReusableTable
        columns={suppliesColumns}
        data={supplies}
        isLoading={isLoading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-card hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
      />
    </>
  );
}
