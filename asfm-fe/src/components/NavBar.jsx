import { Button } from './ui/button';
import { useNavigate } from '@tanstack/react-router';
import logo from '../assets/logo.png';
import { useBoundStore } from '@/store';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { Menu } from 'lucide-react';

function NavBar() {
  const navigate = useNavigate();
  const userRole = useBoundStore((state) => state.userRole);
  const user = useBoundStore((state) => state.user);
  const signOut = useBoundStore((state) => state.signOut);
  const [showHamburger, setShowHamburger] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = () => {
    signOut();
    navigate({ to: '/' });
  };

  useEffect(() => {
    const screenWatcher = () => {
      if (window.innerWidth > 1150) {
        setShowHamburger(false);
      } else {
        setShowHamburger(true);
      }
    };

    screenWatcher();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250);

    window.addEventListener('resize', screenWatcher);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', screenWatcher);
    };
  }, []);

  return (
    <nav className="bg-secondary w-full flex p-2 gap-2 md:p-4 md:gap-4">
      <img src={logo} alt="Company Logo" className="h-17 w-17 -m-3" loading="lazy" />
      {/* Authorized Section*/}
      <div
        className={`flex flex-grid items-center gap-1 md:gap-3 ${showHamburger ? 'w-full' : ''}`}
      >
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          Home
        </Button>
        {userRole === 'USER' && (
          <>
            {showHamburger ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Menu className="ml-auto" />
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col gap-3 pt-10 px-4">
                  <SheetTitle className="text-lg font-semibold sr-only" sr-only="true">
                    User Menu
                  </SheetTitle>
                  <SheetDescription className="sr-only" sr-only="true">
                    Actions for navigating through your user resources
                  </SheetDescription>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/my-animals' })}>
                      My Animals
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/my-supplies' })}>
                      My Supplies
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: '/foster-medical-logs' })}
                    >
                      My Foster Logs
                    </Button>
                  </SheetClose>
                  {user && (
                    <>
                      <div>
                        <div className="bg-gray-200 px-4 py-2 rounded-2xl text-center">
                          {userRole && userRole[0] + userRole.slice(1).toLowerCase()}
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={handleSignOut}>
                          Sign Out
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            ) : (
              <div className="hidden lg:contents">
                <Button variant="outline" onClick={() => navigate({ to: '/my-animals' })}>
                  My Animals
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/my-supplies' })}>
                  My Supplies
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/foster-medical-logs' })}>
                  My Foster Logs
                </Button>
              </div>
            )}
          </>
        )}
        {userRole === 'STAFF' && (
          <>
            {showHamburger ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Menu className="ml-auto" />
                </SheetTrigger>
                <SheetContent side="right" className="flex flex-col gap-3 pt-10 px-4">
                  <SheetTitle className="text-lg font-semibold sr-only" sr-only="true">
                    Navbar Menu
                  </SheetTitle>
                  <SheetDescription className="sr-only" sr-only="true">
                    Actions for navigating through the application
                  </SheetDescription>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/admin-portal' })}>
                      Admin Portal
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/users' })}>
                      All Users
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/animals' })}>
                      Animals
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/inventory' })}>
                      Inventory
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/loans' })}>
                      Loans
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" onClick={() => navigate({ to: '/timeline-view' })}>
                      Med Log
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: '/admin-medical-logs' })}
                    >
                      Admin Logs
                    </Button>
                  </SheetClose>
                  {user && (
                    <>
                      <div>
                        <div className="bg-gray-200 px-4 py-2 rounded-2xl text-center">
                          {userRole && userRole[0] + userRole.slice(1).toLowerCase()}
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button variant="outline" onClick={handleSignOut}>
                          Sign Out
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            ) : (
              <div className="hidden lg:contents">
                <Button variant="outline" onClick={() => navigate({ to: '/admin-portal' })}>
                  Admin Portal
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/users' })}>
                  All Users
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/animals' })}>
                  Animals
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/inventory' })}>
                  Inventory
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/loans' })}>
                  Loans
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/timeline-view' })}>
                  Med Log
                </Button>
                <Button variant="outline" onClick={() => navigate({ to: '/admin-medical-logs' })}>
                  Admin Logs
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Authenticated Section*/}
      <div className="flex items-center gap-1 md:gap-3 ml-auto">
        {isLoading ? null : (
          <>
            {userRole !== 'STAFF' && userRole !== 'USER' && (
              <>
                <Button variant="outline" onClick={() => navigate({ to: '/signin' })}>
                  Sign In
                </Button>
                <Button variant="outline">Sign Up</Button>
              </>
            )}

            {userRole && !showHamburger && (
              <>
                <div>
                  <div className="bg-gray-200 px-4 py-2 rounded-2xl">
                    {userRole && userRole[0] + userRole.slice(1).toLowerCase()}
                  </div>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
