import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const ComingSoonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const pageNames = {
    '/chat': 'Chat',
    '/favorites': 'Favorit',
    '/account': 'Akun'
  };
  
  const pageName = pageNames[location.pathname] || 'Halaman Ini';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title={pageName} />
      
      <div className="max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-6">
          <Construction size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Segera Hadir!</h2>
        <p className="text-gray-600 mb-6 max-w-xs">
          Fitur {pageName} sedang dalam pengembangan. Pantau terus untuk update terbaru!
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
          data-testid="back-to-home-button"
        >
          Kembali ke Beranda
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ComingSoonPage;
