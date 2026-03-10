import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useBoundStore } from '@/store';

export const Route = createFileRoute('/_admin')({
  beforeLoad: async ({ context, location }) => {
    const { initializeAuth } = useBoundStore.getState();

    await initializeAuth();

    const { user, userRole } = useBoundStore.getState();

    if (!user) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href,
        },
      });
    }

    if (userRole !== 'STAFF') {
      throw redirect({
        to: '/',
      });
    }
  },
  component: () => <Outlet />,
});
