import { Button } from "./ui/button";
import { useAuthStore } from "../hooks/useAuthStore";

function TopNavBar() {
  const { isAuthenticated, login, logout } = useAuthStore();
  return (
    <nav className="bg-secondary p-4 flex justify-between">
      <div className="flex flex-grid items-center gap-4">
        {/* Create the logo */}
         <div  className="rounded-md-10  text-secondary-foreground border-black-400 px-4 py-2">Logo</div>
        <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Home</Button>
        {/* is status it not guess add animal div */}
        {isAuthenticated && <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Animal</Button>}
      </div>
      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary" onClick={login}>Sign In</Button>
            <Button variant="outline" className="rounded-full border border-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">Sign Up</Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Button variant="outline" className="text-secondary-foreground">Profile</Button>
            <Button variant="outline" className="text-secondary-foreground" onClick={logout}>Logout</Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopNavBar;
