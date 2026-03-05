import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout'
import BasicNavBar from '@/components/basicNavBar'
import { ReusableTable } from '../components/table_components'
import { useMemo, useState } from 'react'
import { Edit, ClipboardList, Plus } from 'lucide-react'
import { mockLoanedItems } from '../features/mockLoanedItems'
import FilterBar from '@/components/FilterBar'
import FilterSelect from '@/components/custom/FilterSelect'
import InputGroupForSearch from '@/components/InputGroupForSearch'
import { ModalDialog } from '@/components/ModalDialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const LOAN_TYPES = ['Short-Term', 'Long-Term', 'Medical', 'Seasonal', 'Trial']

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export const Route = createFileRoute('/loans')({
  component: RouteComponent,
})

function RouteComponent() {
  const [allLoans] = useState(mockLoanedItems)
  const [loading] = useState(false)
  const [error] = useState(null)
  const [filters, setFilters] = useState({ search: '', loanStatus: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ loanType: '' })
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const loans = useMemo(() => {
    let filtered = allLoans
    if (filters.search) {
      filtered = filtered.filter(l =>
        l.inventoryTransactionId.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    if (filters.loanStatus) {
      filtered = filtered.filter(l => l.loanStatus === filters.loanStatus)
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

    return sorted
  }, [filters, allLoans, sortConfig])

  const handleEdit = (loan) => {
    console.log('Edit loan:', loan)
  }

  const handleClearFilters = () => {
    setFilters({ search: '', loanStatus: '' })
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
    setFormData({ loanType: '' })
    setIsModalOpen(true)
  }

  const handleModalSubmit = () => {
    console.log('Add new loaned item:', formData)
    setIsModalOpen(false)
  }

  const loansColumns = [
    {
      accessorKey: 'itemDescription',
      header: getSortHeader('Item Description', 'itemDescription'),
      textSize: 'sm',
      headClassName: 'min-w-[200px]',
    },
    {
      accessorKey: 'userId',
      header: getSortHeader('User ID', 'userId'),
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'animalId',
      header: getSortHeader('Animal ID', 'animalId'),
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'loanedAt',
      header: getSortHeader('Loaned At', 'loanedAt'),
      textSize: 'sm',
      headClassName: 'min-w-[130px]',
      cell: ({ row }) => formatDate(row.original.loanedAt),
    },
    {
      accessorKey: 'expectedReturnDate',
      header: getSortHeader('Expected Return Date', 'expectedReturnDate'),
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
      cell: ({ row }) => formatDate(row.original.expectedReturnDate),
    },
    {
      accessorKey: 'loanType',
      header: getSortHeader('Loan Type', 'loanType'),
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'loanStatus',
      header: getSortHeader('Loan Status', 'loanStatus'),
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
    },
    {
      accessorKey: 'inventoryTransactionId',
      header: getSortHeader('Inventory Transaction ID', 'inventoryTransactionId'),
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
  ]

  if (error)
    return <div className="flex justify-center pt-8 text-red-500">{error}</div>

  const totalLoans = allLoans.length
  const activeCount = allLoans.filter(l => l.loanStatus === 'Active').length
  const overdueCount = allLoans.filter(l => l.loanStatus === 'Overdue').length
  const returnedCount = allLoans.filter(l => l.loanStatus === 'Returned').length

  return (
    <Layout navBar={<BasicNavBar />}>
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
                <Badge variant="secondary" className="font-medium">{totalLoans} total</Badge>
                {activeCount > 0 && (
                  <Badge variant="outline" className="font-medium border-emerald-500/30 text-emerald-600 bg-emerald-500/5">{activeCount} active</Badge>
                )}
                {overdueCount > 0 && (
                  <Badge variant="outline" className="font-medium border-red-500/30 text-red-600 bg-red-500/5">{overdueCount} overdue</Badge>
                )}
                {returnedCount > 0 && (
                  <Badge variant="outline" className="font-medium border-blue-500/30 text-blue-600 bg-blue-500/5">{returnedCount} returned</Badge>
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
          selectItems={['Active', 'Returned', 'Overdue']}
        />
      </FilterBar>

      {!loading && loans.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">
          No active loans found.
        </div>
      )}
      <ReusableTable
        columns={loansColumns}
        data={loans}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
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
            <Input placeholder="Enter item description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Requesting User ID</label>
            <Input placeholder="Enter user ID" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Requesting Animal ID</label>
            <Input placeholder="Enter animal ID" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loan Type</label>
            <FilterSelect
              value={formData.loanType}
              onChange={(value) => setFormData({ ...formData, loanType: value })}
              selectItems={LOAN_TYPES}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Set Requested Return</label>
            <Input type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              placeholder="Enter additional notes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              rows="4"
            />
          </div>
        </form>
      </ModalDialog>
    </Layout>
  )
}
