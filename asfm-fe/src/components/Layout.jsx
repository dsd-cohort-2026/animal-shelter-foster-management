function Layout({ children, navBar }) {
  return (
    <div className="flex flex-col min-h-screen">
      {navBar}
      <main className="flex-1 p-4">
        {children}
      </main>
      <footer className="border-t border-gray-300 p-4 text-center text-sm text-primary">
        <p>&copy; 2026 ShelterSync.</p>
      </footer>
    </div>
  );
}

export default Layout;
