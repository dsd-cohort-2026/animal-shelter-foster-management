import SignUpForm from '@/components/SignUpForm';
import { useBoundStore } from '@/store';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/SignUp')({
  validateSearch: (search) => ({
    redirect: search.redirect || '/',
  }),
  beforeLoad: async ({ context, search }) => {
    const { initializeAuth, user } = useBoundStore.getState();

    await initializeAuth();

    if (context.user || user) {
      throw redirect({ to: search.redirect || '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpForm />;
}
