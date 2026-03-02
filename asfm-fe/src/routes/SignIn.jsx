import Layout from '@/components/Layout';
import SignInForm from '@/components/SignInForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/SignIn')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <SignInForm />
    </Layout>
  );
}
