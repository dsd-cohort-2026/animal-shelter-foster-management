import { createFileRoute } from '@tanstack/react-router';
import { ReusableTable } from '../../components/table_components';
import { useEffect, useMemo, useState } from 'react';
import apiClient from '../../lib/axios';
import FilterBar from '@/components/FilterBar';
import FilterSelect from '@/components/custom/FilterSelect';
import InputGroupForSearch from '@/components/InputGroupForSearch';
import { ModalDialog } from '@/components/ModalDialog';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Package } from 'lucide-react';
import ConfirmationDialog from '@/components/confirmationDialog';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const Route = createFileRoute('/_admin/inventory')({
  component: RouteComponent,
});

function RouteComponent() {
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [allInventory, setAllInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredInventory = useMemo(() => {
    let filtered = allInventory;
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }
    if (filters.search) {
      filtered = filtered.filter((item) =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase()),
      );
    }
    return filtered;
  }, [allInventory, filters]);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const inventoryRes = await apiClient.get('/inventory');

      const enrichedInventory = inventoryRes.data.map((inv) => ({
        ...inv,
        item_name: inv.item?.name || 'Unknown',
        category: inv.item?.category || 'Unknown',
      }));

      setAllInventory(enrichedInventory);
      setCategories([...new Set(enrichedInventory.map((item) => item.category))]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (inventoryItem) => {
    setEditItem(inventoryItem);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = () => {
    console.log('Edit inventory item:', editItem);
    setIsEditModalOpen(false);
  };

  const handleDelete = (inventoryItem) => {
    setDeleteItem(inventoryItem);
    setShowDeleteConfirm(true);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', category: '' });
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = () => {
    console.log('Add new inventory item');
  };

  const inventoryColumns = [
    {
      accessorKey: 'item_name',
      header: 'Item Name',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[100px]',
    },
    {
      accessorKey: 'expiration_date',
      header: 'Expiration Date',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[150px]',
      cell: ({ row }) => {
        const isCrate = row.original.category === 'CRATE';
        if (isCrate)
          return <span className="invisible">{formatDate(row.original.expiration_date)}</span>;
        return formatDate(row.original.expiration_date);
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1 hover:bg-blue-100 rounded"
            title="Edit"
          >
            <Edit size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  if (error) return (
    <div className="flex flex-col items-center pt-8 gap-3">
      <p className="text-red-500">{error}</p>
      <button
        onClick={fetchData}
        className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Retry
      </button>
    </div>
  );

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <Package className="size-6 sm:size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Inventory
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Browse and manage shelter supply stock.
            </p>
          </div>
        </div>
      </div>

      <FilterBar
        onFilter={() => {}}
        onClear={handleClearFilters}
        onAddNew={handleAddNew}
        addNewButtonLabel="Add New Item"
      >
        <InputGroupForSearch
          placeholder_text="Search by item name"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <FilterSelect
          value={filters.category}
          onChange={(value) => setFilters({ ...filters, category: value })}
          selectItems={categories.length > 0 ? categories : []}
        />
      </FilterBar>

      {!loading && filteredInventory.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">No inventory items found.</div>
      )}
      <ReusableTable
        columns={inventoryColumns}
        data={filteredInventory}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
      />

      <ModalDialog
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title="Add New Inventory Item"
        description="Fill in the details for the new inventory item"
        formId="addItemForm"
        submitHandler={handleModalSubmit}
        trigger={<div />}
      >
        <form id="addItemForm" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <Input placeholder="Enter item name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <FilterSelect
              value=""
              onChange={() => {}}
              selectItems={['FOOD', 'MEDICINE', 'CRATE']}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Species</label>
            <Input placeholder="Enter species" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Input placeholder="Enter unit" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input type="number" placeholder="Enter quantity" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <Input placeholder="Enter brand" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="4"
            />
          </div>
        </form>
      </ModalDialog>
      {showDeleteConfirm && (
        <ConfirmationDialog
          type="error"
          primaryText="Delete Item"
          secondaryText={`Are you sure you want to delete "${deleteItem?.item_name}"?`}
          button="Delete"
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}

      <ModalDialog
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        title="Edit Inventory Item"
        description="Update the details for this inventory item."
        formId="editItemForm"
        submitHandler={handleEditSubmit}
        trigger={<div />}
      >
        <form id="editItemForm" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <Input
              value={editItem?.item_name ?? ''}
              onChange={(e) => setEditItem({ ...editItem, item_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <FilterSelect
              value={editItem?.category ?? ''}
              onChange={(val) => setEditItem({ ...editItem, category: val })}
              selectItems={['FOOD', 'MEDICINE', 'CRATE']}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              value={editItem?.quantity ?? ''}
              onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
            />
          </div>
        </form>
      </ModalDialog>
    </>
  );
}
