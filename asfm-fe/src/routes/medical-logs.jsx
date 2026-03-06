import { createFileRoute } from '@tanstack/react-router';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';

export const Route = createFileRoute('/medical-logs')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout >
      <div className="flex justify-center pt-2">Medical History</div>
      <SearchBar />
    </Layout>
  );
}
