import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeftRight } from 'lucide-react';
import { useBoundStore } from '@/store';
import { useEffect, useState, useMemo } from 'react';
import InventoryTransactionTabs from '@/components/InventoryTransactionTabs';
import { ReusableTable } from '@/components/table_components';
import FilterBar from '@/components/FilterBar';
import FilterSelect from '@/components/custom/FilterSelect';
import InputGroupForSearch from '@/components/InputGroupForSearch';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const Route = createFileRoute('/_admin/transactions')({
  component: RouteComponent,
});

function RouteComponent() {
  const transactions = useBoundStore((state) => state.transactions);
  const fetchTransactions = useBoundStore((state) => state.fetchTransactions);
  const transactionsLoading = useBoundStore((state) => state.transactionsLoading);
  const transactionsError = useBoundStore((state) => state.transactionsError);
  const transactionsFetched = useBoundStore((state) => state.transactionsFetched);
  const [filters, setFilters] = useState({ type: '', search: '' });
  const transactionTypes = ['Loan', 'Distribution', 'Intake'];

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (filters.type) {
      filtered = filtered.filter((transaction) => transaction.type === filters.type.toUpperCase());
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(({ foster_user, item }) => {
        if (foster_user) {
          return (
            `${foster_user.first_name} ${foster_user.last_name}`
              .toLowerCase()
              .includes(searchLower) || item.name.toLowerCase().includes(searchLower)
          );
        } else {
          return item.name.toLowerCase().includes(searchLower);
        }
      });
    }
    return filtered;
  }, [transactions, filters]);

  useEffect(() => {
    if (!transactionsFetched) {
      fetchTransactions();
    }
  }, [transactions, transactionsFetched]);

  const handleRetry = () => {
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({ search: '', type: '' });
  };

  const transactionsColumns = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      sortable: true,
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: 'id',
      header: 'Transaction ID',
      sortable: true,
      headClassName: 'w-[30%]',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      sortable: true,
    },
    {
      accessorKey: 'foster_user',
      header: 'Receipient Name',
      sortable: true,
      cell: ({ row }) => {
        if (row.original.foster_user) {
          return `${row.original.foster_user.first_name} ${row.original.foster_user.last_name}`;
        } else {
          return '-';
        }
      },
      sortFunction: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      accessorKey: 'item',
      header: 'Item Brand',
      sortable: true,
      cell: ({ row }) => `${row.original.item.brand}` || '-',
      sortFunction: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      accessorKey: 'item_name',
      header: 'Item Name',
      sortable: false,
      cell: ({ row }) => `${row.original.item.name}`,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      sortable: false,
      cell: ({ row }) => `${row.original.quantity} ${row.original.item.unit}`,
    },
  ];

  if (transactionsError) {
    return (
      <div className="flex flex-col items-center justify-center pt-8">
        <div className="text-red-500 mb-4">{transactionsError}</div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <ArrowLeftRight className="size-6 sm:size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Transactions
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Search or filter transactions by date, type or amount.
            </p>
          </div>
        </div>
      </div>
      <InventoryTransactionTabs />
      <FilterBar onClear={handleClearFilters} enableAddButton={false}>
        <InputGroupForSearch
          placeholder_text="Search by recipent or item name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FilterSelect
          value={filters.type}
          onChange={(value) => setFilters({ ...filters, type: value })}
          selectItems={transactionTypes.length > 0 ? transactionTypes : []}
        />
      </FilterBar>

      {!transactionsLoading && filteredTransactions.length === 0 ? (
        <div className="flex justify-center pt-8 text-gray-500">No transactions found.</div>
      ) : (
        <ReusableTable
          columns={transactionsColumns}
          data={filteredTransactions}
          isLoading={transactionsLoading}
          headerClassName="bg-secondary text-primary-foreground"
          tablebodyRowClassName="bg-card hover:bg-secondary/20"
          containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
          enablePagination
        />
      )}
    </>
  );
}
