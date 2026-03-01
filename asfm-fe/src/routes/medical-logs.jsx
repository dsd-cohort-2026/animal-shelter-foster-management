import { createFileRoute } from '@tanstack/react-router'
import Layout from '@/components/Layout';
import BasicNavBar from '@/components/basicNavBar'
import SearchBar from '@/components/SearchBar'

export const Route = createFileRoute('/medical-logs')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Layout navBar={<BasicNavBar />}>
      <div className='flex justify-center pt-2'>
        Medical History
      </div>
      <SearchBar />
    </Layout>
  )
}
