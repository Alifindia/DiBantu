import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const FloatingBantuinButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = location.pathname.startsWith('/bantuin');

  // Don't show on bantuin pages
  if (location.pathname.startsWith('/bantuin')) {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/bantuin')}
      className="hidden lg:flex fixed bottom-8 right-8 z-50 items-center gap-2 px-6 py-4 bg-gradient-to-br from-green-600 to-emerald-700 text-white font-bold rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
      data-testid="floating-bantuin-button"
    >
      <Sparkles size={20} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
      <span className="text-base">Bantuin</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
    </button>
  );
};

export default FloatingBantuinButton;
