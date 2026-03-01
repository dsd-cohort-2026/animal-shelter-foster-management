import App from '@/App';
import { createFileRoute } from '@tanstack/react-router';
import TopNavBar from '@/components/NonMemberSignInNavBar';
import SearchBar from '@/components/SearchBar'
import Layout from '@/components/Layout';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout navBar={<TopNavBar />}>
      <App />
    </Layout>
  );
}
