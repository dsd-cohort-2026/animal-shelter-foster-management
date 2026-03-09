import { createFileRoute } from '@tanstack/react-router';
import SingleAnimalPage from '@/pages/SingleAnimalPage';
import BasicNavBar from '@/components/NavBar';

export const Route = createFileRoute('/single-animal/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <>
      <BasicNavBar />
      <SingleAnimalPage id={id} />
    </>
  );
}
