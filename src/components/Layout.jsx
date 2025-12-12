import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Plus,
  Users,
  Settings,
  LogOut,
  Server,
  ChevronRight,
  Cpu
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const { user, isAdmin, toggleUserRole } = useApp();

  const studentLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/launch', icon: Plus, label: 'Launch Cluster' },
  ];

  const adminLinks = [
    { to: '/admin', icon: Users, label: 'Students' },
    { to: '/admin/clusters', icon: Server, label: 'All Clusters' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-[#30363d]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-k8s-blue rounded-lg flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">KubeLearn</h1>
            <p className="text-xs text-gray-500">Training Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-k8s-blue text-white'
                    : 'text-gray-400 hover:bg-[#21262d] hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Role Toggle */}
      <div className="p-4 border-t border-[#30363d]">
        <button
          onClick={toggleUserRole}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#21262d] hover:text-white transition-all duration-200"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">
            Switch to {isAdmin ? 'Student' : 'Admin'} View
          </span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-[#30363d]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-k8s-blue to-purple-600 flex items-center justify-center text-white font-semibold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success'
              ? 'bg-green-900/90 border-green-700 text-green-100'
              : toast.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-red-100'
              : 'bg-blue-900/90 border-blue-700 text-blue-100'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
