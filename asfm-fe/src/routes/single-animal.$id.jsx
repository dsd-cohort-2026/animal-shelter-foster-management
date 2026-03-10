import { createFileRoute } from '@tanstack/react-router';
import SingleAnimalPage from '@/pages/SingleAnimalPage';

export const Route = createFileRoute('/single-animal/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <>
      <SingleAnimalPage id={id} />
    </>
  );
}
