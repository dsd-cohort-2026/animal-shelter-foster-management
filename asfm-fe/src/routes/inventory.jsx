import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout';
import BasicNavBar from '@/components/basicNavBar'
import { ReusableTable } from '../components/table_components'
import { useEffect, useState } from 'react'
import apiClient from '../lib/axios';
import FilterBar from '@/components/FilterBar'
import FilterSelect from '@/components/custom/FilterSelect';
import InputGroupForSearch from '@/components/InputGroupForSearch'
import { ModalDialog } from '@/components/ModalDialog'
import { Input } from '@/components/ui/input'
import { Edit, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/inventory')({
  component: RouteComponent,
})

function RouteComponent() {
  const [filters, setFilters] = useState({ category: '', search: '' })
  const [inventory, setInventory] = useState([])
  const [allInventory, setAllInventory] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, itemsRes] = await Promise.all([
          apiClient.get('/inventory'),
          apiClient.get('/items'),
        ])

        const itemMap = {}
        const categoryMap = {}
        itemsRes.data.forEach(item => {
          itemMap[item.id] = item.name
          categoryMap[item.id] = item.category
        })

        const enrichedInventory = inventoryRes.data.map(inv => ({
          ...inv,
          item_name: itemMap[inv.item_id] || 'Unknown',
          category: categoryMap[inv.item_id] || 'Unknown',
        }))

        setAllInventory(enrichedInventory)
        setInventory(enrichedInventory)
        setCategories([...new Set(enrichedInventory.map(item => item.category))])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load inventory. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = allInventory

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category)
    }

    if (filters.search) {
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (!sortConfig.key) return 0
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return sortConfig.direction === 'asc'
        ? aVal - bVal
        : bVal - aVal
    })

    setInventory(sorted)
  }, [filters, allInventory, sortConfig])

  const handleEdit = (inventoryItem) => {
    // TODO: Implement edit functionality
    console.log('Edit:', inventoryItem)
  }

  const handleDelete = (inventoryItem) => {
    // TODO: Implement delete functionality
    console.log('Delete:', inventoryItem)
  }

  const handleClearFilters = () => {
    setFilters({ search: '', category: '' })
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortHeader = (label, key) => {
    const isActive = sortConfig.key === key
    const indicator = isActive ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''
    return (
      <button
        onClick={() => handleSort(key)}
        className="flex items-center gap-1 hover:text-gray-700 font-medium"
      >
        {label}{indicator}
      </button>
    )
  }

  const handleAddNew = () => {
    setIsModalOpen(true)
  }

  const handleModalSubmit = () => {
    console.log('Add new inventory item')
  }

  const inventoryColumns = [
    {
      accessorKey: "item_name",
      header: getSortHeader("Item Name", "item_name"),
      textSize: "sm",
      headClassName: "min-w-[180px]",
    },
    {
      accessorKey: "category",
      header: getSortHeader("Category", "category"),
      textSize: "sm",
      headClassName: "min-w-[180px]",
    },
    {
      accessorKey: "quantity",
      header: getSortHeader("Quantity", "quantity"),
      textSize: "sm",
      headClassName: "min-w-[100px]",
    },
    {
      accessorKey: "expiration_date",
      header: getSortHeader("Expiration Date", "expiration_date"),
      textSize: "sm",
      headClassName: "min-w-[150px]",
    },
    {
      id: "actions",
      header: "Actions",
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
  ]

  if (error) return <div className="flex justify-center pt-8 text-red-500">{error}</div>

  return (
    <Layout navBar={<BasicNavBar />}>
      <div className='flex justify-center py-2'>
        Inventory
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

      {!loading && inventory.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">No inventory items found.</div>
      )}
      <ReusableTable
        columns={inventoryColumns}
        data={inventory}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName='overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full px-4 lg:px-8'
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
    </Layout>
  )
}
