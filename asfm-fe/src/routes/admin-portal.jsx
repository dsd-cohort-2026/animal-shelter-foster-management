import { createFileRoute } from '@tanstack/react-router'
import AdminPortal from '@/admin-portal'
import Layout from '@/components/Layout';
import BasicNavBar from "@/components/basicNavBar";
import SearchBar from '@/components/SearchBar'

export const Route = createFileRoute('/admin-portal')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout navBar={<BasicNavBar />}>
      <AdminPortal />
    </Layout>
  )
}
