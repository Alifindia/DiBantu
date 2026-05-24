import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, MapPin, MessageCircle, Trash2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import { getTechnicians, startConversation } from '../api/api';
import { getFavorites, toggleFavorite } from '../utils/favorites';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [allTechnicians, setAllTechnicians] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const techs = await getTechnicians();
        setAllTechnicians(techs);
        setFavoriteIds(getFavorites());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const favoriteTechnicians = allTechnicians.filter(t => favoriteIds.includes(t.id));

  const handleRemove = (id) => {
    toggleFavorite(id);
    setFavoriteIds(getFavorites());
  };

  const handleChat = async (techId) => {
    try {
      const conv = await startConversation(techId);
      navigate(`/chat/${conv.id}`);
    } catch (e) { console.error(e); }
  };

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      <DesktopNav />
      <header className="lg:hidden bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="lg:hidden p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-bold text-lg lg:text-2xl text-gray-900">Favorit</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-green-700 font-medium text-sm">Kembali ke Beranda</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          </div>
        ) : favoriteTechnicians.length > 0 ? (
          <>
            <p className="text-sm lg:text-base text-gray-600 mb-4">
              {favoriteTechnicians.length} teknisi tersimpan sebagai favorit
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5" data-testid="favorites-list">
              {favoriteTechnicians.map(tech => (
                <div key={tech.id} className="bg-white rounded-xl shadow-sm p-4 lg:p-5" data-testid={`favorite-${tech.id}`}>
                  <div className="flex gap-3 lg:gap-4">
                    <img src={tech.photo_url} alt={tech.name} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{tech.name}</h3>
                          <p className="text-xs lg:text-sm text-gray-600">{tech.specialization}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs lg:text-sm">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star size={14} fill="currentColor" />
                              <span className="text-gray-900 font-medium">{tech.rating}</span>
                              <span className="text-gray-500">({tech.reviews_count})</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <MapPin size={12} />
                              <span>{tech.distance} km</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Transport: {formatPrice(tech.transportation_fee_min)} - {formatPrice(tech.transportation_fee_max)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(tech.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                          data-testid={`remove-favorite-${tech.id}`}
                        >
                          <Heart size={20} fill="currentColor" />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleChat(tech.id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-green-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition"
                          data-testid={`chat-tech-${tech.id}`}
                        >
                          <MessageCircle size={14} />
                          Chat
                        </button>
                        <button
                          onClick={() => navigate('/technicians/all')}
                          className="flex-1 bg-white border border-green-700 text-green-700 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition"
                        >
                          Pesan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Heart size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Belum ada favorit</h2>
            <p className="text-sm text-gray-500 mb-6">Tambahkan teknisi pilihan Anda agar mudah dipesan lagi nanti.</p>
            <button
              onClick={() => navigate('/technicians/all')}
              className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-800 transition"
            >
              Jelajahi Teknisi
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default FavoritesPage;
