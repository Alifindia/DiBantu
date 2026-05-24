import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, MessageCircle, User, Sparkles } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const sideNavItems = [
    { icon: Home, label: 'Beranda', path: '/', testId: 'nav-home' },
    { icon: FileText, label: 'Pesanan', path: '/my-orders', testId: 'nav-orders' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', testId: 'nav-chat' },
    { icon: User, label: 'Akun', path: '/account', testId: 'nav-account' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg" style={{ zIndex: 1000 }}>
      <div className="max-w-md mx-auto flex justify-around items-end py-2 relative">
        {/* Left side - 2 nav items */}
        {sideNavItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                active ? 'text-green-700' : 'text-gray-500 hover:text-green-600'
              }`}
              data-testid={item.testId}
            >
              <Icon size={22} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}

        {/* Center Floating BANTUIN Button */}
        <button
          onClick={() => navigate('/bantuin')}
          className="relative -mt-6 flex flex-col items-center"
          data-testid="nav-bantuin"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-105 ${
            isActive('/bantuin') 
              ? 'bg-gradient-to-br from-green-600 to-emerald-700 ring-4 ring-green-200' 
              : 'bg-gradient-to-br from-green-700 to-emerald-600'
          }`}>
            <Sparkles size={26} className="text-white" strokeWidth={2.5} />
          </div>
          <span className={`text-[11px] font-bold mt-1 ${isActive('/bantuin') ? 'text-green-700' : 'text-gray-700'}`}>
            Bantuin
          </span>
        </button>

        {/* Right side - 2 nav items */}
        {sideNavItems.slice(2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
                active ? 'text-green-700' : 'text-gray-500 hover:text-green-600'
              }`}
              data-testid={item.testId}
            >
              <Icon size={22} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
