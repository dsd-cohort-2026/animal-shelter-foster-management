import { createFileRoute } from '@tanstack/react-router'
import AdminPortal from '@/admin-portal'

export const Route = createFileRoute('/adminPortal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminPortal/>
}
