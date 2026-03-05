import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout'
import BasicNavBar from '@/components/basicNavBar'
import { ReusableTable } from '../components/table_components'
import { useState } from 'react'
import { mockLoanedItems } from '../features/mockLoanedItems'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month}/${day}/${year}`
}

export const Route = createFileRoute('/my-supplies')({
  component: RouteComponent,
})

function RouteComponent() {
  // TODO: replace with real auth — const { user } = useAuthStore()
  const mockUser = { role: 'USER', userId: 'U-1024' }
  // To test access denied, change to: const mockUser = { role: 'STAFF', userId: 'U-1024' }

  const [supplies] = useState(
    mockUser.role === 'USER'
      ? mockLoanedItems.filter((item) => item.userId === mockUser.userId)
      : []
  )
  const [loading] = useState(false)
  const [error] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const sortedSupplies = [...supplies].sort((a, b) => {
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

  const suppliesColumns = [
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
  ]

  if (mockUser.role !== 'USER') {
    return (
      <Layout navBar={<BasicNavBar />}>
        <div className="flex justify-center items-center h-64 text-red-500 text-lg font-semibold">
          Access Denied
        </div>
      </Layout>
    )
  }

  if (error)
    return <div className="flex justify-center pt-8 text-red-500">{error}</div>

  return (
    <Layout navBar={<BasicNavBar />}>
      <div className="flex justify-center py-2">My Supplies</div>

      <div className="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full">
        <div className="flex justify-between items-center px-4 lg:px-8 py-3 bg-white border-b border-pale-sky">
          <span className="text-sm text-gray-600 font-medium">User ID: {mockUser.userId}</span>
          <span className="text-sm font-semibold">My Animal's Loaned Items</span>
        </div>

        {!loading && supplies.length === 0 && (
          <div className="flex justify-center pt-8 text-gray-500">
            No supplies currently assigned to you.
          </div>
        )}
        <ReusableTable
          columns={suppliesColumns}
          data={sortedSupplies}
          isLoading={loading}
          headerClassName="bg-secondary text-primary-foreground"
          tablebodyRowClassName="bg-white hover:bg-secondary/20"
          containerClassName="px-4 lg:px-8 overflow-auto"
        />
      </div>
    </Layout>
  )
}
