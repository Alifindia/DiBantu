import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Sparkles, MessageCircle, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const items = [
    { icon: Home, label: 'Beranda', path: '/', testId: 'bottom-nav-home' },
    { icon: FileText, label: 'Pesanan', path: '/my-orders', testId: 'bottom-nav-orders' },
    { icon: Sparkles, label: 'Bantuin', path: '/bantuin', highlight: true, testId: 'bottom-nav-bantuin' },
    { icon: MessageCircle, label: 'Chat', path: '/chat', testId: 'bottom-nav-chat' },
    { icon: User, label: 'Akun', path: '/account', testId: 'bottom-nav-account' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {items.map(({ icon: Icon, label, path, highlight, testId }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              highlight
                ? isActive(path)
                  ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white scale-110 -translate-y-2 shadow-xl'
                  : 'bg-gradient-to-br from-green-700 to-emerald-600 text-white scale-110 -translate-y-2 shadow-lg'
                : isActive(path)
                ? 'text-green-700'
                : 'text-gray-500'
            }`}
            data-testid={testId}
          >
            <Icon size={highlight ? 22 : 20} strokeWidth={highlight ? 2.5 : 2} />
            <span className={`text-xs font-medium ${
              highlight ? 'font-bold' : ''
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
