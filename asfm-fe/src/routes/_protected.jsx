import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useBoundStore } from '@/store';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    const { initializeAuth, user } = useBoundStore.getState();

    await initializeAuth(); // force beforeLoad to wait for context before redirecting

    if (!context.user && !user) {
      throw redirect({
        to: '/signin',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: () => <Outlet />,
});
