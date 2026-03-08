import { createFileRoute } from '@tanstack/react-router';
import { ReusableTable } from '../../components/table_components';
import { useEffect, useState } from 'react';
import apiClient from '../../lib/axios';
import { Users as UsersIcon } from 'lucide-react';

export const Route = createFileRoute('/_admin/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get('/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const userColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[180px]',
      cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[200px]',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[100px]',
    },
    {
      accessorKey: 'address',
      header: 'Address',
      sortable: true,
      textSize: 'sm',
      headClassName: 'min-w-[150px]',
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center pt-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm:p-8 mb-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <UsersIcon className="size-6 sm:size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              All Users
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              View and manage all registered users.
            </p>
          </div>
        </div>
      </div>

      {!loading && users.length === 0 && (
        <div className="flex justify-center pt-8 text-gray-500">No users found.</div>
      )}
      <ReusableTable
        columns={userColumns}
        data={users}
        isLoading={loading}
        headerClassName="bg-secondary text-primary-foreground"
        tablebodyRowClassName="bg-white hover:bg-secondary/20"
        containerClassName="overflow-auto max-h-150 rounded-lg border border-pale-sky shadow-sm relative w-full"
      />
    </>
  );
}
