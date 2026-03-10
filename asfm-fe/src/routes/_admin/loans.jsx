import { createFileRoute } from '@tanstack/react-router';
import { ReusableTable } from '../../components/table_components';
import { useMemo, useState, useEffect } from 'react';
import { useBoundStore } from '@/store';
import { Edit, ClipboardList } from 'lucide-react';
import apiClient from '@/lib/axios';
import FilterBar from '@/components/FilterBar';
import FilterSelect from '@/components/custom/FilterSelect';
import InputGroupForSearch from '@/components/InputGroupForSearch';
import { ModalDialog } from '@/components/ModalDialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const Route = createFileRoute('/_admin/loans')({
  component: RouteComponent,
});

function RouteComponent() {
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filters, setFilters] = useState({ search: '', loanStatus: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ loanType: '' });
  const filteredLoans = useMemo(() => {
    let filtered = allLoans;
    if (filters.search) {
      filtered = filtered.filter((l) =>
        l.inventoryTransactionId.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    if (filters.loanStatus) {
      filtered = filtered.filter((l) => l.loanStatus === filters.loanStatus);
    }
    return filtered;
  }, [filters, allLoans]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await apiClient.get('/inventory-transactions?type=LOAN&limit=10000');
        const loans = res.data.map((transaction) => ({
          inventoryTransactionId: transaction.id,
          itemDescription: transaction.item?.name,
          quantity: transaction.quantity,
          userId: `${transaction.foster_user?.first_name} ${transaction.foster_user?.last_name}`,
          loanedAt: transaction.created_at,
          loanStatus: transaction.status[0] + transaction.status.slice(1).toLowerCase(),
        }));
        setAllLoans(loans);
      } catch (err) {
        setError('Failed loading loans. Try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleEdit = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', loanStatus: '' });
  };

  const handleAddNew = () => {
    setFormData({ loanType: '' });
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    console.log('Add new loaned item:', formData);
    setIsModalOpen(false);
  };

  const loansColumns = [
    {
      accessorKey: 'itemDescription',
      header: 'Item Description',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[200px]',
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'loanedAt',
      header: 'Loaned At',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[130px]',
      cell: ({ row }) => formatDate(row.original.loanedAt),
    },
    {
      accessorKey: 'expectedReturnDate',
      header: 'Expected Return Date',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
      cell: ({ row }) => {
        const isCrate = row.original.itemDescription.toLowerCase().includes('crate');
        if (!isCrate)
          return <span className="invisible">{formatDate(row.original.expectedReturnDate)}</span>;
        return formatDate(row.original.expectedReturnDate);
      },
    },
    {
      accessorKey: 'loanStatus',
      header: 'Loan Status',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'inventoryTransactionId',
      header: 'Inventory Transaction ID',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => handleEdit(row.original)}
          className="p-1 hover:bg-blue-100 rounded"
          title="Edit"
        >
          <Edit size={18} className="text-blue-600" />
        </button>
      ),
    },
  ];

  if (error) return <div className="flex justify-center pt-8 text-red-500">{error}</div>;

  const totalLoans = allLoans.length;
  const activeCount = allLoans.filter((l) => l.loanStatus === 'Active').length;
  const returnedCount = allLoans.filter((l) => l.loanStatus === 'Complete').length;

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
              <ClipboardList className="size-6 sm:size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Shelter's Loaned Items
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Track and manage all shelter supply loans.
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <Badge variant="secondary" className="font-medium">
                  {totalLoans} total
                </Badge>
                {activeCount > 0 && (
                  <Badge
                    variant="outline"
                    className="font-medium border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                  >
                    {activeCount} active
                  </Badge>
                )}
                {returnedCount > 0 && (
                  <Badge
                    variant="outline"
                    className="font-medium border-blue-500/30 text-blue-600 bg-blue-500/5"
                  >
                    {returnedCount} complete
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <FilterBar
        onFilter={() => {}}
        onClear={handleClearFilters}
        onAddNew={handleAddNew}
        addNewButtonLabel="Add New Loaned Item"
      >
        <InputGroupForSearch
          placeholder_text="Search by Transaction ID"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FilterSelect
          value={filters.loanStatus}
          onChange={(value) => setFilters({ ...filters, loanStatus: value })}
          selectItems={['Active', 'Complete']}
        />
      </FilterBar>

      {!loading && filteredLoans.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">No active loans found.</div>
      )}
      <ReusableTable
        columns={loansColumns}
        data={filteredLoans}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
        initialSort={{ key: 'expectedReturnDate', direction: 'asc' }}
      />

      <ModalDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Add/Edit New Loaned Item"
        description="Fill in the details for the loaned item"
        formId="addLoanForm"
        submitHandler={handleModalSubmit}
        trigger={<div />}
      >
        <form id="addLoanForm" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Description</label>
            <Input
              placeholder="Enter item description"
              value={selectedLoan?.itemDescription || ''}
              onChange={(e) =>
                setSelectedLoan({ ...selectedLoan, itemDescription: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User Loaning Item</label>
            <Input
              placeholder="Enter user ID"
              value={selectedLoan?.userId || ''}
              onChange={(e) => setSelectedLoan({ ...selectedLoan, userId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              placeholder="Enter quantity"
              value={selectedLoan?.quantity || ''}
              onChange={(e) => setSelectedLoan({ ...selectedLoan, quantity: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Set Loan Date</label>
            <Input
              type="date"
              placeholder="Enter loan date"
              value={selectedLoan?.loanedAt || ''}
              onChange={(e) => setSelectedLoan({ ...selectedLoan, loanedAt: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loan Status</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={selectedLoan?.loanStatus ?? ''}
              onChange={(e) => setSelectedLoan({ ...selectedLoan, loanStatus: e.target.value })}
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETE">Complete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              placeholder="Enter additional notes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="4"
              value={selectedLoan?.notes || ''}
              onChange={(e) => setSelectedLoan({ ...selectedLoan, notes: e.target.value })}
            />
          </div>
        </form>
      </ModalDialog>
    </>
  );
}
