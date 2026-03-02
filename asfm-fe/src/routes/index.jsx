import App from '@/App';
import { createFileRoute } from '@tanstack/react-router';
import Layout from '@/components/Layout';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout>
      <App />
    </Layout>
  );
}
