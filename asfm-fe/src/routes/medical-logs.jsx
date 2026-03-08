import { createFileRoute } from '@tanstack/react-router';
import SearchBar from '@/components/SearchBar';

export const Route = createFileRoute('/medical-logs')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex justify-center pt-2">Medical History</div>
      <SearchBar />
    </>
  );
}
