import { createFileRoute, redirect } from '@tanstack/react-router';

function AdminMedicalLogsRedirect() {
  return null;
}

export const Route = createFileRoute('/_admin/admin-medical-logs')({
  beforeLoad: () => {
    throw redirect({
      to: '/timeline-view',
      search: { view: 'table' },
      replace: true,
    });
  },
  component: AdminMedicalLogsRedirect,
});
