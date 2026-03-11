import { useLocation, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export default function TabsBar() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });
  const navigate = useNavigate();

  const clickHandler = (path) => {
    navigate({ to: path });
  };

  return (
    <div className="mb-4 px-3 flex gap-3">
      <Button onClick={() => clickHandler('/inventory')} disabled={pathname === '/inventory'}>
        Inventory
      </Button>
      <Button onClick={() => clickHandler('/transactions')} disabled={pathname === '/transactions'}>
        Transactions
      </Button>
    </div>
  );
}
