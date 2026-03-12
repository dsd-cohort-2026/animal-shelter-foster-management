import { createFileRoute } from '@tanstack/react-router';
import { ReusableTable } from '../../components/table_components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import apiClient from '../../lib/axios';
import FilterBar from '@/components/FilterBar';
import FilterSelect from '@/components/custom/FilterSelect';
import InputGroupForSearch from '@/components/InputGroupForSearch';
import { ModalDialog } from '@/components/ModalDialog';
import { Input } from '@/components/ui/input';
import InventoryTransactionTabs from '@/components/InventoryTransactionTabs';
import { Edit, Package } from 'lucide-react';
import { useBoundStore } from '@/store';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

export const Route = createFileRoute('/_admin/inventory')({
  component: RouteComponent,
});

const EMPTY_NEW_ITEM = {
  item_name: '',
  category: '',
  species: '',
  unit: '',
  quantity: '',
  brand: '',
  description: '',
  notes: '',
  expiration_date: '',
  // FOOD
  life_stage: '',
  // CRATE
  crate_size: '',
  crate_status: '',
  // MEDICINE
  medication_dose: '',
  medication_route: '',
  medication_side_effects: '',
};

function RouteComponent() {
  const user = useBoundStore((state) => state.user);

  const [filters, setFilters] = useState({ category: '', search: '' });
  const [allInventory, setAllInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState(EMPTY_NEW_ITEM);
  const [isAddSubmitting, setIsAddSubmitting] = useState(false);
  const [addError, setAddError] = useState(null);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState(null);

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

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Add New Item ---
  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async () => {
    setIsAddSubmitting(true);
    setAddError(null);
    try {
      await apiClient.post('/inventory-transactions/intake', {
        item_name: newItem.item_name,
        item_category: newItem.category,
        item_species: newItem.species,
        item_unit: newItem.unit,
        item_is_active: true,
        item_brand: newItem.brand || '',
        item_description: newItem.description || '',
        quantity: Number(newItem.quantity),
        status: 'COMPLETE',
        notes: newItem.notes || '-',
        staff_user: user.id,
        ...(newItem.expiration_date && {
          inventory_expiration_date: new Date(newItem.expiration_date).toISOString(),
        }),
        ...(newItem.category === 'FOOD' && { item_food_life_stage: newItem.life_stage }),
        ...(newItem.category === 'CRATE' && {
          item_crate_size: newItem.crate_size,
          item_crate_status: newItem.crate_status,
        }),
        ...(newItem.category === 'MEDICINE' && {
          item_medication_dose: newItem.medication_dose,
          item_medication_administration_route: newItem.medication_route,
          item_medication_side_effects: newItem.medication_side_effects || '',
        }),
      });
      setIsModalOpen(false);
      setNewItem(EMPTY_NEW_ITEM);
      await fetchData();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item. Please try again.';
      setAddError(message);
    } finally {
      setIsAddSubmitting(false);
    }
  };

  // --- Edit ---
  const handleEdit = (inventoryItem) => {
    setEditItem({
      ...inventoryItem,
      notes: '',
      expiration_date: inventoryItem.expiration_date
        ? inventoryItem.expiration_date.split('T')[0]
        : '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    setIsEditSubmitting(true);
    setEditError(null);
    try {
      await apiClient.patch(`/inventory/${editItem.id}`, {
        quantity: Number(editItem.quantity),
        item_id: editItem.item_id,
        staff_user: user.id,
        notes: editItem.notes || '-',
        ...(editItem.expiration_date && {
          expiration_date: new Date(editItem.expiration_date).toISOString(),
        }),
      });
      setIsEditModalOpen(false);
      await fetchData();
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to update inventory. Please try again.';
      setEditError(message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({ search: '', category: '' });
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
            className="p-1 hover:bg-blue-100 rounded cursor-pointer"
            title="Edit"
          >
            <Edit size={18} className="text-blue-600" />
          </button>
        </div>
      ),
    },
  ];

  if (error)
    return (
      <div className="flex flex-col items-center pt-8 gap-3">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
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
      <InventoryTransactionTabs />
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
        tablebodyRowClassName="bg-card hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
        enablePagination
      />

      {/* Add New Item Modal */}
      <ModalDialog
        open={isModalOpen}
        setOpen={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setNewItem(EMPTY_NEW_ITEM);
            setAddError(null);
          }
        }}
        title="Add New Inventory Item"
        description="Fill in the details for the new inventory item"
        formId="addItemForm"
        submitHandler={handleModalSubmit}
        isSubmitting={isAddSubmitting}
        trigger={<div />}
      >
        <form id="addItemForm" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <Input
              placeholder="Enter item name"
              required
              value={newItem.item_name}
              onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <FilterSelect
              value={newItem.category}
              onChange={(val) => setNewItem({ ...newItem, category: val, expiration_date: '' })}
              selectItems={['FOOD', 'MEDICINE', 'CRATE']}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Species</label>
            <FilterSelect
              value={newItem.species}
              onChange={(val) => setNewItem({ ...newItem, species: val })}
              selectItems={['CAT', 'DOG']}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <Input
              placeholder="e.g. lbs, oz, units"
              required
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              min="0"
              placeholder="Enter quantity"
              required
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
          </div>
          {(newItem.category === 'FOOD' || newItem.category === 'MEDICINE') && (
            <div>
              <label className="block text-sm font-medium mb-1">Expiration Date</label>
              <Input
                type="date"
                value={newItem.expiration_date}
                onChange={(e) => setNewItem({ ...newItem, expiration_date: e.target.value })}
              />
            </div>
          )}
          {newItem.category === 'FOOD' && (
            <div>
              <label className="block text-sm font-medium mb-1">Life Stage</label>
              <FilterSelect
                value={newItem.life_stage}
                onChange={(val) => setNewItem({ ...newItem, life_stage: val })}
                selectItems={['ADOLESCENT', 'ADULT', 'SENIOR']}
              />
            </div>
          )}
          {newItem.category === 'CRATE' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Crate Size</label>
                <FilterSelect
                  value={newItem.crate_size}
                  onChange={(val) => setNewItem({ ...newItem, crate_size: val })}
                  selectItems={['SMALL', 'MEDIUM', 'LARGE']}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Crate Status</label>
                <FilterSelect
                  value={newItem.crate_status}
                  onChange={(val) => setNewItem({ ...newItem, crate_status: val })}
                  selectItems={['AVAILABLE', 'LOANED', 'DAMAGED']}
                />
              </div>
            </>
          )}
          {newItem.category === 'MEDICINE' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Recommended Dose</label>
                <Input
                  placeholder="e.g. 1 tablet per 10 lbs"
                  required
                  value={newItem.medication_dose}
                  onChange={(e) => setNewItem({ ...newItem, medication_dose: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Administration Route</label>
                <Input
                  placeholder="e.g. oral, topical"
                  required
                  value={newItem.medication_route}
                  onChange={(e) => setNewItem({ ...newItem, medication_route: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Side Effects</label>
                <Input
                  placeholder="Known side effects (optional)"
                  value={newItem.medication_side_effects}
                  onChange={(e) =>
                    setNewItem({ ...newItem, medication_side_effects: e.target.value })
                  }
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <Input
              placeholder="Enter brand (optional)"
              value={newItem.brand}
              onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="3"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input
              placeholder="Reason for intake (optional)"
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
            />
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
        </form>
      </ModalDialog>

      {/* Edit Item Modal */}
      <ModalDialog
        open={isEditModalOpen}
        setOpen={(open) => {
          setIsEditModalOpen(open);
          if (!open) setEditError(null);
        }}
        title="Edit Inventory Item"
        description="Update the details for this inventory item."
        formId="editItemForm"
        submitHandler={handleEditSubmit}
        isSubmitting={isEditSubmitting}
        trigger={<div />}
      >
        <form id="editItemForm" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <p className="text-sm text-muted-foreground px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
              {editItem?.item_name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <p className="text-sm text-muted-foreground px-3 py-2 border border-gray-200 rounded-md bg-gray-50">
              {editItem?.category}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              min="0"
              value={editItem?.quantity ?? ''}
              onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
            />
          </div>
          {editItem?.category !== 'CRATE' && (
            <div>
              <label className="block text-sm font-medium mb-1">Expiration Date</label>
              <Input
                type="date"
                value={editItem?.expiration_date ?? ''}
                onChange={(e) => setEditItem({ ...editItem, expiration_date: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <Input
              placeholder="Reason for adjustment (optional)"
              value={editItem?.notes ?? ''}
              onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })}
            />
          </div>
          {editError && <p className="text-sm text-red-600">{editError}</p>}
        </form>
      </ModalDialog>
    </>
  );
}
