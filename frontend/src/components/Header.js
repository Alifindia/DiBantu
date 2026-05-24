import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Header = ({ title, subtitle, showBack = false, className = '' }) => {
  const navigate = useNavigate();

  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-1 hover:bg-gray-100 rounded-full transition"
              data-testid="header-back-button"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
          )}
          <div>
            {title && (
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs lg:text-sm text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Logo for desktop */}
        <div className="hidden lg:flex flex-col text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="font-extrabold text-xl">
              <span className="text-gray-900">Di</span>
              <span className="text-green-700">Bantu</span>
            </span>
          </div>
          <p className="text-xs text-gray-500">Cari bantuan terpercaya, cepat, dan aman</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
