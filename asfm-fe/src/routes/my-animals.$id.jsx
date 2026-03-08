import MyAnimalsListPage from '@/pages/MyAnimalsListPage';
import BasicNavBar from '@/components/basicNavBar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-animals/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <>
      <BasicNavBar />
      <MyAnimalsListPage id={id} />
    </>
  );
}
