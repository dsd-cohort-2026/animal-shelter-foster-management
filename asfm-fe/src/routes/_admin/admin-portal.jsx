import { createFileRoute } from '@tanstack/react-router';
import AdminPortal from '@/admin-portal';

export const Route = createFileRoute('/_admin/admin-portal')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AdminPortal />;
}
