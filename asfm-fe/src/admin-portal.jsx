import { useState, useEffect } from 'react';
import { useBoundStore } from '@/store';
import apiClient from '@/lib/axios';
import { DashboardSummaryCard } from '@/components/DashboardSummaryCard';
import DashboardCard from '@/components/custom/DashboardCard';
import { Button } from '@/components/ui/button';
import { Loader2, Users, PawPrint, ArrowLeftRight, Timer } from 'lucide-react';

function AdminPortal() {
  const session = useBoundStore((state) => state.session);
  const [users, setUsers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [animalsError, setAnimalsError] = useState(null);
  const [inventoryError, setInventoryError] = useState(null);
  const [transactionsError, setTransactionsError] = useState(null);

  const authHeader = { Authorization: `Bearer ${session?.access_token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setUsersError(null);
      setAnimalsError(null);
      setInventoryError(null);
      setTransactionsError(null);
      try {
        const userData = await apiClient.get('/users', { headers: authHeader });
        setUsers(userData.data);
      } catch (err) {
        console.error(`User fetch error: ${err}`);
        setUsersError(`There was an error loading the users!`);
      }

      try {
        const animalData = await apiClient.get('/animals', { headers: authHeader });
        setAnimals(animalData.data);
      } catch (err) {
        console.error(`Animal fetch error: ${err}`);
        setAnimalsError(`There was an error loading the animals!`);
      }

      try {
        const inventoryData = await apiClient.get('/inventory', { headers: authHeader });
        setInventory(inventoryData.data);
      } catch (err) {
        console.error(`Inventory fetch error: ${err}`);
        setInventoryError(`There was an error loading the inventory!`);
      }

      try {
        const transactionData = await apiClient.get('/inventory-transactions?limit=10000', {
          headers: authHeader,
        });
        setTransactions(transactionData.data);
      } catch (err) {
        console.error(`Inventory Transaction fetch error: ${err}`);
        setTransactionsError(`There was an error loading the inventory transactions!`);
      }

      setLoading(false);
    };
    fetchAll();
  }, []);

  const userRows = users.map((user) => ({
    name: `${user.first_name} ${user.last_name}`,
    role: user.role,
    email: user.email,
    phone: user.phone,
  }));

  const animalRows = animals.map((animal) => ({
    name: animal.name,
    species: animal.species,
    status: animal.foster_status,
    sex: animal.sex,
  }));

  const inventoryRows = inventory.map((inv) => ({
    quantity: inv.quantity,
    brand: inv.item?.brand,
    name: inv.item?.name,
    species: inv.item?.species,
    category: inv.item?.category,
  }));

  const transactionRows = transactions.map((transaction) => ({
    quantity: transaction.quantity,
    item: transaction.item?.name,
    type: transaction.type,
    status: transaction.status,
  }));

  const loanRows = transactions
    .filter((transaction) => {
      return transaction.type === 'LOAN' && transaction.status === 'ACTIVE';
    })
    .map((transaction) => ({
      quantity: transaction.quantity,
      'loaned to': `${transaction.foster_user?.first_name} ${transaction.foster_user?.last_name}`,
      item: transaction.item?.name,
    }));

  return (
    <div className="p-6 space-y-6">
      <div className="relative overflow-hidden rounded-xl border bg-card p-6 sm-p-8">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center size-12 sm:size-14 rounded-xl bg-secondary/20 shrink-0">
            <Users className="size-6 sm:size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Administrative Portal
            </h1>
            <p className="test-muted-foreground mt-1 text-sm sm:text-base">
              Shelter Records Overview:
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardSummaryCard
          title="All Users"
          value={loading ? '...' : users.length}
          subtitle="Active Accounts"
          icon={<Users className="size-6" />}
        />
        <DashboardSummaryCard
          title="Total Animals"
          value={loading ? '...' : animals.length}
          subtitle="Registered Animals"
          icon={<PawPrint className="size-6" />}
        />
        <DashboardSummaryCard
          title="Active Loans"
          value={loading ? '...' : loanRows.length}
          subtitle="Outstanding Loans"
          icon={<Timer className="size-6" />}
        />
        <DashboardSummaryCard
          title="All Transactions"
          value={loading ? '...' : transactions.length}
          subtitle="Transaction History"
          icon={<ArrowLeftRight className="size-6" />}
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
          <Loader2 className="animate-spin size-5" />
          Loading Shelter Details...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard
            title="Users"
            navLink="users"
            itemsArray={userRows.length ? userRows : [{ info: 'No Users Found' }]}
            cardDescriptionClassName="max-h-64 overflow-y-auto"
          />
          <DashboardCard
            title="Animals"
            navLink="animals"
            itemsArray={animalRows.length ? animalRows : [{ info: 'No Animals Found' }]}
            cardDescriptionClassName="max-h-64 overflow-y-auto"
          />
          <DashboardCard
            title="Inventory"
            navLink="inventory"
            itemsArray={inventoryRows.length ? inventoryRows : [{ info: 'No Inventory Found' }]}
            cardDescriptionClassName="max-h-64 overflow-y-auto"
          />
          <DashboardCard
            title="Transactions"
            navLink="transactions"
            itemsArray={
              transactionRows.length
                ? transactionRows.slice(0, 20)
                : [{ info: 'No Transactions Found' }]
            }
            cardDescriptionClassName="max-h-64 overflow-y-auto"
          />
          <DashboardCard
            title="Active Loans"
            navLink="loans"
            itemsArray={loanRows.length ? loanRows : [{ info: 'No Active Loans Found' }]}
            cardDescriptionClassName="max-h-64 overflow-y-auto"
          />
        </div>
      )}
    </div>
  );
}

export default AdminPortal;
