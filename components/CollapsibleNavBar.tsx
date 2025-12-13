import React, { useState } from 'react';
import { Menu, X, Home, LogOut, Settings, Bell, User, MessageSquare } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface CollapsibleNavBarProps {
  userName: string;
  navItems: NavItem[];
  onLogout: () => void;
  hasNotifications?: boolean;
}

export const CollapsibleNavBar: React.FC<CollapsibleNavBarProps> = ({
  userName,
  navItems,
  onLogout,
  hasNotifications = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleNavClick = (onClick: () => void) => {
    onClick();
    closeMenu();
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-brand-400 tracking-tight">KEKE</h1>
          </div>

          {/* Center: User Info */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <User size={16} className="text-brand-300" />
            <span className="font-medium">{userName}</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications Bell */}
            <button
              className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Mobile User Name (visible only on mobile) */}
            <span className="sm:hidden text-xs font-medium mr-2">{userName.split(' ')[0]}</span>

            {/* Logout Button (hidden on mobile, visible on larger screens) */}
            <button
              onClick={onLogout}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-800/50 backdrop-blur-sm">
            <div className="px-2 py-4 space-y-1">
              {/* User Profile Section (Mobile) */}
              <div className="px-4 py-3 bg-slate-700/30 rounded-lg mb-2">
                <p className="text-sm font-medium text-brand-300">{userName}</p>
                <p className="text-xs text-gray-400 mt-1">Active Account</p>
              </div>

              {/* Navigation Items */}
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.onClick)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-slate-700 rounded-lg transition-colors text-left font-medium"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Divider */}
              <div className="my-2 h-px bg-slate-700"></div>

              {/* Logout Button (Mobile) */}
              <button
                onClick={() => handleNavClick(onLogout)}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar (visible only on md and larger screens) */}
      <aside className="hidden md:flex fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-slate-900 text-white flex-col shadow-lg border-r border-slate-800 z-30">
        {/* Profile Section */}
        <div className="px-6 py-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-500/20 rounded-full flex items-center justify-center">
              <User size={24} className="text-brand-400" />
            </div>
            <div>
              <p className="font-semibold text-white">{userName}</p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left font-medium group"
            >
              <span className="text-gray-400 group-hover:text-brand-400 transition-colors">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-6 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 top-16 md:hidden bg-black/30 backdrop-blur-sm z-20"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default CollapsibleNavBar;
