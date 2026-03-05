import App from '@/App';
import { createFileRoute } from '@tanstack/react-router';
import Layout from '@/components/Layout';
import { useBoundStore } from '@/store';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const loading = useBoundStore((state) => state.loading);
  return (
    <Layout>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <App />
      )}
    </Layout>
  );
}
