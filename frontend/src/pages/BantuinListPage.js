import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, ChevronRight, MapPin, Clock } from 'lucide-react';
import { getBantuinRequests } from '../api/api';

const BantuinListPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getBantuinRequests();
        setRequests(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);

  const statusBadge = (s) => ({
    searching: { label: '🔍 Mencari Helper', color: 'bg-yellow-100 text-yellow-700' },
    helper_selected: { label: '✅ Helper Dipilih', color: 'bg-blue-100 text-blue-700' },
    on_the_way: { label: '🛵 Menuju Lokasi', color: 'bg-orange-100 text-orange-700' },
    in_progress: { label: '🔧 Sedang Dikerjakan', color: 'bg-orange-100 text-orange-700' },
    completed: { label: '🎉 Selesai', color: 'bg-green-100 text-green-700' },
    cancelled: { label: '❌ Dibatalkan', color: 'bg-red-100 text-red-700' },
  }[s] || { label: s, color: 'bg-gray-100 text-gray-700' });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/bantuin')} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-green-700" />
            <h1 className="font-bold text-lg text-gray-900">Permintaan Saya</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-3" data-testid="requests-list">
            {requests.map((req) => {
              const badge = statusBadge(req.status);
              return (
                <div
                  key={req.id}
                  onClick={() => navigate(`/bantuin/request/${req.id}`)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 lg:p-5 cursor-pointer transition card-hover"
                  data-testid={`request-${req.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">#{req.request_number}</span>
                    <span className={`text-[10px] lg:text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{req.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{req.detail}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1 truncate max-w-[120px]">
                        <MapPin size={12} /> {req.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {req.schedule}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-green-700 text-sm">{formatPrice(req.final_price || req.budget)}</p>
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <Sparkles size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-semibold mb-1">Belum ada request</p>
            <p className="text-sm text-gray-500 mb-6">Mulai buat request Bantuin pertama Anda!</p>
            <button
              onClick={() => navigate('/bantuin')}
              className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition"
              data-testid="create-first-request"
            >
              Buat Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BantuinListPage;
