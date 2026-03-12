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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const user = useBoundStore((state) => state.user);
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', loanStatus: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_id: '',
    foster_user: '',
    quantity: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

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
    const fetchAll = async () => {
      try {
        const [loanData, itemsData, usersData] = await Promise.allSettled([
          apiClient.get('/inventory-transactions?type=LOAN&limit=1000'),
          apiClient.get('/items'),
          apiClient.get('/users'),
        ]);
        setAllLoans(
          loanData.value.data.map((trans) => ({
            inventoryTransactionId: trans.id,
            itemDescription: trans.item?.name,
            quantity: trans.quantity,
            transactionNotes: trans.notes || '-',
            userId: `${trans.foster_user?.first_name} ${trans.foster_user?.last_name}`,
            loanedAt: trans.created_at,
            loanStatus: trans.status[0] + trans.status.slice(1).toLowerCase(),
          })),
        );
        setAllItems(itemsData.value.data);
        setAllUsers(usersData.value.data);
      } catch (err) {
        setError('Failed loading data. Try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleClearFilters = () => {
    setFilters({ search: '', loanStatus: '' });
  };

  const handleAddNew = () => {
    setFormData({ item_id: '', foster_user: '', quantity: '', notes: '' });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    const errors = validate(formData);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    try {
      await apiClient.post('/inventory-transactions/distribute', {
        type: 'LOAN',
        status: 'ACTIVE',
        item_id: formData.item_id,
        foster_user: formData.foster_user,
        staff_user: user.id,
        quantity: Number(formData.quantity),
        notes: formData.notes || '',
      });
      setIsModalOpen(false);
      setLoading(true);
      const res = await apiClient.get('/inventory-transactions?type=LOAN&limit=1000');
      setAllLoans(
        res.data.map((trans) => ({
          inventoryTransactionId: trans.id,
          itemDescription: trans.item?.name,
          quantity: trans.quantity,
          transactionNotes: trans.notes || '-',
          userId: `${trans.foster_user?.first_name} ${trans.foster_user?.last_name}`,
          loanedAt: trans.created_at,
          loanStatus: trans.status[0] + trans.status.slice(1).toLowerCase(),
        })),
      );
    } catch (err) {
      setFieldErrors({
        api: err.response?.data?.message || 'Failed to create loan. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId, newStatus, quantity) => {
    try {
      await apiClient.patch(`/inventory-transactions/${transactionId}/status`, {
        status: newStatus.toUpperCase(),
        staff_user: user.id,
        quantity,
      });
      const trigger = document.querySelector(`[data-id="${transactionId}"]`);
      if (trigger) {
        trigger.style.borderColor = 'var(--secondary)';
        trigger.style.borderWidth = '2px';
        setTimeout(() => {
          trigger.style.borderColor = '';
          trigger.style.borderWidth = '';
        }, 5000);
      }
      setAllLoans((prev) =>
        prev.map((loan) => {
          return loan.inventoryTransactionId === transactionId
            ? { ...loan, loanStatus: newStatus[0].toUpperCase() + newStatus.slice(1).toLowerCase() }
            : loan;
        }),
      );
    } catch (err) {
      console.error(`There was an error while updating the status of this loan: ${err}`);
    }
  };

  const validate = (data) => {
    const errors = {};
    if (!data.item_id) errors.item_id = 'Item is required for a loan!';
    if (!data.foster_user) errors.foster_user = 'To whom do you intend to loan this?';
    if (!data.quantity) errors.quantity = `You can't loan nothing!`;
    return errors;
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
      header: 'Foster User',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[60px]',
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
      accessorKey: 'transactionNotes',
      header: 'Transaction Notes',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[200px] ',
      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-[300px]">
          {row.original.transactionNotes}
        </div>
      ),
    },
    {
      accessorKey: 'loanStatus',
      header: 'Loan Status',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
      cell: ({ row }) => (
        <Select
          value={row.original.loanStatus.toUpperCase()}
          onValueChange={(val) =>
            handleStatusChange(row.original.inventoryTransactionId, val, row.original.quantity)
          }
        >
          <SelectTrigger className="w-[120px]" data-id={row.original.inventoryTransactionId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETE">Complete</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: 'inventoryTransactionId',
      header: 'Inventory Transaction ID',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
    },
  ];

  if (error) return <div className="flex justify-center pt-8 text-red-500">{error}</div>;

  const totalLoans = allLoans.length;
  const activeCount = allLoans.filter((l) => l.loanStatus.toLowerCase() === 'active').length;
  const returnedCount = allLoans.filter((l) => l.loanStatus.toLowerCase() === 'complete').length;

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
        tablebodyRowClassName="bg-card hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
        enablePagination
        initialSort={{ key: 'expectedReturnDate', direction: 'asc' }}
      />

      <ModalDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Add New Loan"
        description="Submit Loan Details"
        formId="addLoanForm"
        submitHandler={handleModalSubmit}
        trigger={<div />}
      >
        <form id="addLoanForm" className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          {fieldErrors.api && <p className="text-sm text-red-500">{fieldErrors.api}</p>}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Item: <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.item_id}
              onValueChange={(val) => {
                setFormData({ ...formData, item_id: val });
                setFieldErrors((prev) => ({ ...prev, item_id: undefined }));
              }}
            >
              <SelectTrigger className={`w-full ${fieldErrors.item_id ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select Item"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                {allItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.item_id && <p className="text-xs text-red-500">{fieldErrors.item_id}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Loaned To: <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.foster_user}
              onValueChange={(val) => {
                setFormData({ ...formData, foster_user: val });
                setFieldErrors((prev) => ({ ...prev, foster_user: undefined }));
              }}
            >
              <SelectTrigger
                className={`w-full ${fieldErrors.foster_user ? 'border-red-500' : ''}`}
              >
                <SelectValue placeholder="Select a foster user" />
              </SelectTrigger>
              <SelectContent>
                {allUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.first_name} {u.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.foster_user && (
              <p className="text-xs text-red-500">{fieldErrors.foster_user}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="1"
              placeholder="Enter quantity"
              className={`w-full ${fieldErrors.quantity ? 'border-red-500' : ''}`}
              value={formData.quantity}
              onChange={(e) => {
                setFormData({ ...formData, quantity: e.target.value });
                setFieldErrors((prev) => ({ ...prev, quantity: undefined }));
              }}
            />
            {fieldErrors.quantity && <p className="text-xs text-red-500">{fieldErrors.quantity}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              placeholder="Enter additional notes (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </form>
      </ModalDialog>
    </>
  );
}
