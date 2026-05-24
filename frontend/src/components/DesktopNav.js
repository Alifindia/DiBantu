import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, MapPin } from 'lucide-react';

const DesktopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Beranda', path: '/', testId: 'desktop-nav-home' },
    { label: 'Pesanan', path: '/my-orders', testId: 'desktop-nav-orders' },
    { label: 'Chat', path: '/chat', testId: 'desktop-nav-chat' },
    { label: 'Favorit', path: '/favorites', testId: 'desktop-nav-favorites' },
  ];

  return (
    <header className="hidden lg:block bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex flex-col text-left">
          <img 
            src="/assets/logo-dibantu.png" 
            alt="DiBantu" 
            className="h-8 w-auto"
          />
          <p className="text-gray-500 mt-1 text-xs lg:text-sm">Cari bantuan terpercaya, cepat, dan aman</p>
        </button>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`font-medium transition ${
                isActive(item.path) ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-700'
              }`}
              data-testid={item.testId}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-green-700" />
            <span>Jl. Melati No.10, Depok</span>
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-full" data-testid="notification-button-desktop">
            <Bell size={20} className="text-gray-700" />
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">3</span>
          </button>
          <button onClick={() => navigate('/account')} className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold hover:bg-green-200" data-testid="desktop-nav-account">U</button>
        </div>
      </div>
    </header>
  );
};

export default DesktopNav;
