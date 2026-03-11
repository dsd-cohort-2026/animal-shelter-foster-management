import NavBar from './NavBar';
import ChatWidget from './chat/ChatWidget';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 p-4">{children}</main>
      <ChatWidget />
      <footer className="border-t border-gray-300 p-4 text-center text-sm text-primary">
        <p>&copy; 2026 ShelterSync.</p>
      </footer>
    </div>
  );
}

export default Layout;
