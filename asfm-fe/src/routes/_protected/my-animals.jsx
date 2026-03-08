import MyAnimalsListPage from '@/pages/MyAnimalsListPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected/my-animals')({
  component: RouteComponent,
});

function RouteComponent() {

  return (
    <>
      <MyAnimalsListPage  />
    </>
  );
}
