import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout'
import BasicNavBar from '@/components/basicNavBar'
import { ReusableTable } from '../components/table_components'
import { useState } from 'react'
import { mockLoanedItems } from '../features/mockLoanedItems'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag } from 'lucide-react'

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
  const suppliesColumns = [
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
      accessorKey: 'animalId',
      header: 'Animal ID',
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
      cell: ({ row }) => formatDate(row.original.expectedReturnDate),
    },
    {
      accessorKey: 'loanType',
      header: 'Loan Type',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[120px]',
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

  const activeCount = supplies.filter(s => s.loanStatus === 'Active').length
  const returnedCount = supplies.filter(s => s.loanStatus === 'Returned').length

  return (
    <Layout navBar={<BasicNavBar />}>
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
              User ID: {mockUser.userId} — supplies assigned to your foster animals.
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant="secondary" className="font-medium">{supplies.length} total</Badge>
              {activeCount > 0 && (
                <Badge variant="outline" className="font-medium border-emerald-500/30 text-emerald-600 bg-emerald-500/5">{activeCount} active</Badge>
              )}
              {returnedCount > 0 && (
                <Badge variant="outline" className="font-medium border-blue-500/30 text-blue-600 bg-blue-500/5">{returnedCount} returned</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {!loading && supplies.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">
          No supplies currently assigned to you.
        </div>
      )}
      <ReusableTable
        columns={suppliesColumns}
        data={supplies}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
      />
    </Layout>
  )
}
