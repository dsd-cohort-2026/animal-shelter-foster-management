import { Button } from "./ui/button";
import { useAuthStore } from "../hooks/useAuthStore";
import { useNavigate, useRouter } from '@tanstack/react-router'

function BasicNavBar() {
const { isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();
  const router = useRouter()
  
  const handleLogOut = () => {
    logout();
    navigate({ to: '/' }); // Navigate to home page after logout
  };

  // Debug: Log all routes
  return (
    <nav className="bg-secondary p-4 flex justify-between">
      <div className="flex  items-center gap-4">
        {/* Create the logo */}
         <div  className="rounded-md  text-secondary-foreground border-black px-4 py-2">Logo</div>
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Home</Button>
        {/* is status it not guess add animal div */}
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">All Users</Button>
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary text-s">My Animals</Button>
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Inventory</Button>
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Loans</Button>
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Med Log</Button>
      </div>
      <div className="flex end gap-4">

        <div className="flex items-center gap-4">
        <div>
            <div className="bg-gray-200 px-4 py-2 rounded-2xl"> UserName</div>
        </div>
        <Button variant="outline" className="rounded-full border border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary" onClick={handleLogOut}>Logout</Button>
        </div>
      </div>
    </nav>
  );
}

export default BasicNavBar;