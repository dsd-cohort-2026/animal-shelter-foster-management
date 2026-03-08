import SignInForm from '@/components/SignInForm';
import { useBoundStore } from '@/store';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/SignIn')({
  validateSearch: (search) => ({
    redirect: search.redirect || '/',
  }),
  beforeLoad: async ({ context, search }) => {
    const { initializeAuth, user } = useBoundStore.getState();

    await initializeAuth(); // force beforeLoad to wait for context before redirecting

    if (context.user || user) {
      throw redirect({ to: search.redirect || '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInForm />;
}
