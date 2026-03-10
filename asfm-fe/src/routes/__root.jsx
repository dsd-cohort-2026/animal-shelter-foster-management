import AuthProvider from '@/components/AuthProvider';
import Layout from '@/components/Layout';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => (
  <AuthProvider>
    <Layout>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </Layout>
  </AuthProvider>
);

export const Route = createRootRoute({ component: RootLayout });
