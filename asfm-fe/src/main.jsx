import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen'; // Auto-generated
// Create the router instance
import './index.css';
import { useBoundStore } from './store';

const router = createRouter({
  routeTree,
  context: { user: undefined, loading: true, userRole: undefined },
});

// wrapper component to inject auth context
function App() {
  const user = useBoundStore((state) => state.user);
  const loading = useBoundStore((state) => state.loading);
  const userRole = useBoundStore((state) => state.userRole);

  return <RouterProvider router={router} context={{ user, loading, userRole }} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
