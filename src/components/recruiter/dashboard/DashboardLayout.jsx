const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Recruiter Dashboard</h1>
        </div>
        <nav className="mt-4 space-y-1">
          {['Dashboard', 'Jobs', 'Candidates', 'Interviews', 'Analytics'].map(item => (
            <a key={item} className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
              {item}
            </a>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Dashboard Overview</h2>
            <div className="flex items-center space-x-4">
              {/* Notifications and user menu */}
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};