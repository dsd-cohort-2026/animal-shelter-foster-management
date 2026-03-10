import { createFileRoute, Outlet } from '@tanstack/react-router';
import SearchBar from '@/components/SearchBar';

export const Route = createFileRoute('/medical-logs')({
  component: () => (
    <>
      <div className="flex justify-center pt-2">Medical History</div>
      <SearchBar />
      <Outlet />
    </>
  ),
});