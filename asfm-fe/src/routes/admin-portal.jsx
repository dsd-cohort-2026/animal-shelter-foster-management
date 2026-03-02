import { createFileRoute } from '@tanstack/react-router';
import AdminPortal from '@/admin-portal';
import Layout from '@/components/Layout';

export const Route = createFileRoute('/admin-portal')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <AdminPortal />
    </Layout>
  );
}
