import { useNavigate } from '@tanstack/react-router';
import { useBoundStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function RoleGuard({ allowedRoles, children }) {
  const navigate = useNavigate();
  const { role } = useBoundStore((state) => state.user);

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">
          You don't have permission to view this page.
        </p>
        <Button variant="outline" onClick={() => navigate({ to: '/medical-logs' })}>
          ← Back to Medical Logs
        </Button>
      </div>
    );
  }

  return children;
}
