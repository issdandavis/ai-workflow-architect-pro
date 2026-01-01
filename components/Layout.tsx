
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  GitBranch, 
  BarChart3, 
  Code2, 
  Settings, 
  ShoppingBag, 
  HardDrive, 
  Users, 
  PlugZap,
  Search,
  Bell,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/workflow', icon: GitBranch, label: 'Workflow' },
  { path: '/agent-dev', icon: Code2, label: 'Agent Dev' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/roundtable', icon: Users, label: 'Roundtable' },
  { path: '/storage', icon: HardDrive, label: 'Storage' },
  { path: '/shop', icon: ShoppingBag, label: 'Shop' },
  { path: '/integrations', icon: PlugZap, label: 'Integrations' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GitBranch size={20} className="text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">Architect <span className="text-indigo-500 italic">Pro</span></span>}
        </div>

        <nav className="flex-1 mt-4 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-500"
          >
            <ChevronRight className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-full w-96">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search workflows, agents, or assets..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Alex Rivera</p>
                <p className="text-xs text-slate-500">Architect Lead</p>
              </div>
              <img src="https://picsum.photos/seed/arch/100/100" className="w-10 h-10 rounded-full border-2 border-indigo-500" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-950 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
