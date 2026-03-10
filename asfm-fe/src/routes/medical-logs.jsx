import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/medical-logs')({
  component: () => <Outlet />,
});