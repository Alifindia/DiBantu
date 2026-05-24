import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, ShieldCheck, Star, MapPin, CheckCircle, Info, Heart } from 'lucide-react';
import { getTechnicians } from '../api/api';
import { getFavorites, toggleFavorite } from '../utils/favorites';

const TechniciansPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.service;

  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    loadTechnicians();
  }, [serviceId, sortBy]);

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      const data = await getTechnicians(serviceId === 'all' ? null : serviceId, sortBy);
      setTechnicians(data);
    } catch (error) {
      console.error('Error loading technicians:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (e, id) => {
    e.stopPropagation();
    toggleFavorite(id);
    setFavorites(getFavorites());
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContinue = () => {
    if (selectedTechnician) {
      navigate('/order-summary', {
        state: { service, technician: selectedTechnician }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full transition" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Pilih Teknisi</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {/* Verification Badge Banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 lg:p-4 mb-4 lg:mb-6 flex items-start gap-3">
          <ShieldCheck className="text-green-700 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-xs lg:text-sm text-gray-700">
            <span className="font-semibold">Semua teknisi telah terverifikasi</span> & berpengalaman.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6 overflow-x-auto pb-2">
          {[
            { id: 'distance', label: 'Terdekat' },
            { id: 'rating', label: 'Rating' },
            { id: 'price', label: 'Harga' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSortBy(opt.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border ${
                sortBy === opt.id
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
              }`}
              data-testid={`sort-${opt.id}`}
            >
              {opt.label} ▾
            </button>
          ))}
          <button className="ml-auto w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50">
            <Filter size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Layout: List + (Desktop only) Summary */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Technicians List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-3 lg:space-y-4" data-testid="technicians-list">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTechnician(tech)}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-md p-4 lg:p-5 cursor-pointer transition card-hover ${
                      selectedTechnician?.id === tech.id ? 'ring-2 ring-green-700' : ''
                    }`}
                    data-testid={`technician-card-${tech.id}`}
                  >
                    <div className="flex gap-3 lg:gap-4">
                      <img
                        src={tech.photo_url}
                        alt={tech.name}
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-gray-900 text-base lg:text-lg">{tech.name}</h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleToggleFavorite(e, tech.id)}
                              className={`p-1.5 rounded-full transition ${
                                favorites.includes(tech.id)
                                  ? 'text-red-500 hover:bg-red-50'
                                  : 'text-gray-400 hover:bg-gray-100 hover:text-red-500'
                              }`}
                              data-testid={`favorite-btn-${tech.id}`}
                            >
                              <Heart size={18} fill={favorites.includes(tech.id) ? 'currentColor' : 'none'} />
                            </button>
                            <div className="text-right">
                              <p className="text-[10px] lg:text-xs text-gray-500">Biaya Transportasi</p>
                              <p className="font-bold text-green-700 text-sm lg:text-base">
                                {formatPrice(tech.transportation_fee_min)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs lg:text-sm text-gray-600 mb-2">{tech.specialization}</p>
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star size={14} fill="currentColor" />
                              <span className="text-gray-900 font-medium">{tech.rating}</span>
                              <span className="text-gray-500">({tech.reviews_count} ulasan)</span>
                            </div>
                          </div>
                          <span className="text-[10px] lg:text-xs text-gray-500">
                            {formatPrice(tech.transportation_fee_min)} - {formatPrice(tech.transportation_fee_max)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={12} />
                            <span>{tech.distance} km dari lokasi Anda</span>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedTechnician?.id === tech.id ? 'border-green-700 bg-green-700' : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedTechnician?.id === tech.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                        </div>
                        {tech.verified && (
                          <div className="flex items-center gap-1 mt-2">
                            <CheckCircle size={14} className="text-green-700" />
                            <span className="text-xs text-green-700 font-medium">Terverifikasi</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {technicians.length === 0 && (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                    Tidak ada teknisi tersedia
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 lg:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 lg:p-4">
              <div className="flex items-start gap-2">
                <Info size={16} className="text-blue-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs lg:text-sm text-gray-700">
                  Biaya transportasi dihitung berdasarkan jarak teknisi ke lokasi Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop: Summary Panel */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Ringkasan</h3>
              {service && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Layanan</p>
                  <p className="font-semibold text-gray-900">{service.name}</p>
                  <p className="text-sm text-green-700 font-bold mt-1">{formatPrice(service.base_price)}</p>
                </div>
              )}
              {selectedTechnician ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Teknisi Dipilih</p>
                    <div className="flex items-center gap-3 mt-2">
                      <img src={selectedTechnician.photo_url} alt={selectedTechnician.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900">{selectedTechnician.name}</p>
                        <p className="text-xs text-gray-600">{selectedTechnician.specialization}</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Biaya Transportasi</p>
                    <p className="font-bold text-green-700">{formatPrice(selectedTechnician.transportation_fee_min)}</p>
                  </div>
                  <button
                    onClick={handleContinue}
                    className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition mt-4"
                    data-testid="continue-to-summary-button-desktop"
                  >
                    Lanjut ke Ringkasan
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-6">
                  Pilih teknisi untuk melanjutkan
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Continue Button */}
      {selectedTechnician && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <button
            onClick={handleContinue}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
            data-testid="continue-to-summary-button"
          >
            Lanjut ke Ringkasan
          </button>
        </div>
      )}
    </div>
  );
};

export default TechniciansPage;
