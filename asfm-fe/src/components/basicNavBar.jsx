import { Button } from './ui/button';
import { useAuthStore } from '../hooks/useAuthStore';
import { useNavigate, useRouter } from '@tanstack/react-router';
import logo from '../assets/logo.png';

function BasicNavBar() {
  const { isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();
  const router = useRouter();

  const handleLogOut = () => {
    logout();
    navigate({ to: '/' }); // Navigate to home page after logout
  };
  const handleMedicalLog = () => {
    navigate({ to: '/medical-logs' });
  };
  const handleAnimals = () => {
    navigate({ to: '/animals' });
  };

  const handleInventory = () => {
    navigate({ to: '/inventory' });
  };

  const handleLoans = () => {
    navigate({ to: '/loans' });
  };

  // Debug: Log all routes
  return (
    <nav className="bg-secondary p-4 flex justify-between">
      <div className="flex items-center gap-4">
        {/* Create the logo */}
        <img src={logo} alt='Company Logo' className='h-17 w-17 -m-3' loading='lazy' />
        <Button variant="outline">Home</Button>
        {/* is status it not guess add animal div */}
        <Button variant="outline">All Users</Button>
        <Button variant="outline" className="text-s">
          My Animals
        </Button>
        <Button variant="outline" onClick={handleAnimals}>
          Animals
        </Button>
        <Button variant="outline" onClick={handleInventory}>Inventory</Button>
        <Button variant="outline" onClick={handleLoans}>Loans</Button>
        <Button variant="outline" onClick={handleMedicalLog}>
          Med Log
        </Button>
      </div>
      <div className="flex end gap-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="bg-gray-200 px-4 py-2 rounded-2xl"> UserName</div>
          </div>
          <Button variant="outline" onClick={handleLogOut}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default BasicNavBar;
