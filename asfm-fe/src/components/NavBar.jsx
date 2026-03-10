import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import logo from '../assets/logo.png';
import { useBoundStore } from '@/store';

function NavBar() {
  const navigate = useNavigate();
  const userRole = useBoundStore((state) => state.userRole);
  const user = useBoundStore((state) => state.user);
  const signOut = useBoundStore((state) => state.signOut);

  const handleSignOut = () => {
    signOut();
    navigate({ to: '/' });
  };

  return (
    <nav className="bg-secondary w-full flex p-2 gap-2 md:p-4 md:gap-4">
      <img src={logo} alt="Company Logo" className="h-17 w-17 -m-3" loading="lazy" />
      {/* Authorized Section*/}
      <div className="flex flex-grid items-center gap-1 md:gap-3">
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          Home
        </Button>
        {userRole === 'USER' && (
          <>
            <Button variant="outline" onClick={() => navigate({ to: '/my-animals' })}>My Animals</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/my-supplies' })}>
              My Supplies
            </Button>
          </>
        )}
        {userRole === 'STAFF' && (
          <>
            <Button variant="outline" onClick={() => navigate({ to: '/admin-portal' })}>
              Admin Portal
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/users' })}>All Users</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/animals' })}>Animals</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/inventory' })}>Inventory</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/loans' })}>Loans</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/medical-logs' })}>
              Med Log
            </Button>
          </>
        )}
      </div>

      {/* Authenticated Section*/}
      <div className="flex items-center gap-1 md:gap-3 ml-auto">
        {user ? (
          <div className="flex items-center gap-1 md:gap-3 ml-auto">
            <div>
              <div className="bg-gray-200 px-4 py-2 rounded-2xl">{userRole}</div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate({ to: '/signin' })}>
              Sign In
            </Button>
            <Button variant="outline">Sign Up</Button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
