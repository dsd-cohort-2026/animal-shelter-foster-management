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
    navigate({ to: '/' });
    signOut();
  };

  return (
    <nav className="bg-secondary p-4 flex gap-4">
      <img src={logo} alt="Company Logo" className="h-17 w-17 -m-3" loading="lazy" />
      {/* Authorized Section*/}
      <div className="flex flex-grid items-center gap-4">
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          Home
        </Button>
        {userRole === 'USER' && <Button variant="outline">My Animals</Button>}
        {userRole === 'STAFF' && (
          <>
            <Button variant="outline" onClick={() => navigate({ to: 'admin-portal' })}>
              Admin Portal
            </Button>
            <Button variant="outline">All Users</Button>
            <Button variant="outline" className="text-s">
              Animals
            </Button>
            <Button variant="outline">Inventory</Button>
            <Button variant="outline">Loans</Button>
            <Button variant="outline" onClick={() => navigate({ to: '/medical-logs' })}>
              Med Log
            </Button>
          </>
        )}
      </div>

      {/* Authenticated Section*/}
      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <div className="flex items-center gap-4 ml-auto">
            <div>
              <div className="bg-gray-200 px-4 py-2 rounded-2xl">
                {user.user_metadata.first_name}
              </div>
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
