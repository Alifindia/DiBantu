import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

const Header = ({ title, showBack = false, showLocation = false }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-green-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={() => navigate(-1)}
              className="hover:bg-green-600 p-1 rounded-full transition"
              data-testid="back-button"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          {!showBack && !title && (
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-green-700 font-bold text-xl">🏠</span>
              </div>
              <span className="font-bold text-lg">TemuJasa</span>
            </div>
          )}
          {title && <h1 className="font-bold text-lg">{title}</h1>}
        </div>
        
        {showLocation && (
          <div className="flex items-center gap-1 text-sm" data-testid="location-display">
            <MapPin size={16} />
            <span>Jl. Melati No.10, Depok</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;