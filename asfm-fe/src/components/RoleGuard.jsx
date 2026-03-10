import { useNavigate } from '@tanstack/react-router';
import { useBoundStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function RoleGuard({
  allowedRoles,
  children,
  redirectTo = '/medical-logs',
  message = "You don't have permission to view this page.",
}) {
  const navigate = useNavigate();
  const userRole = useBoundStore((state) => state.userRole);

  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">{message}</p>
        <Button variant="outline" onClick={() => navigate({ to: redirectTo })}>
          ← Go Back
        </Button>
      </div>
    );
  }

  return children;
}
