import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, Clock, ShieldCheck, CheckCircle2, Phone, MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { getBantuinRequest, getBantuinOffers, selectBantuinHelper, updateBantuinStatus } from '../api/api';

const BantuinDetailPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [requestId]);

  const loadData = async () => {
    try {
      const [req, offs] = await Promise.all([
        getBantuinRequest(requestId),
        getBantuinOffers(requestId)
      ]);
      setRequest(req);
      setOffers(offs);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);

  const handleSelectHelper = async (offerId) => {
    try {
      setProcessing(true);
      await selectBantuinHelper(requestId, offerId);
      await loadData();
    } catch (e) {
      console.error(e);
      alert('Gagal memilih helper');
    } finally {
      setProcessing(false);
    }
  };

  const handleAdvanceStatus = async (newStatus) => {
    try {
      setProcessing(true);
      await updateBantuinStatus(requestId, newStatus);
      await loadData();
    } catch (e) { console.error(e); }
    finally { setProcessing(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Request tidak ditemukan</p>
          <button onClick={() => navigate('/bantuin')} className="bg-green-700 text-white px-6 py-2 rounded-lg">Kembali</button>
        </div>
      </div>
    );
  }

  const selectedOffer = offers.find(o => o.id === request.selected_offer_id);

  const statusSteps = [
    { id: 'searching', label: 'Mencari Helper', emoji: '🔍' },
    { id: 'helper_selected', label: 'Helper Ditemukan', emoji: '✅' },
    { id: 'on_the_way', label: 'Helper Menuju Lokasi', emoji: '🛵' },
    { id: 'in_progress', label: 'Sedang Dikerjakan', emoji: '🔧' },
    { id: 'completed', label: 'Selesai', emoji: '🎉' },
  ];

  const currentStepIdx = statusSteps.findIndex(s => s.id === request.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/bantuin')} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles size={18} className="text-green-700 flex-shrink-0" />
            <h1 className="font-bold text-lg text-gray-900 truncate">Detail Request</h1>
          </div>
          <span className="text-xs text-gray-500">#{request.request_number}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 lg:py-8 space-y-4 lg:space-y-5">

        {/* Request Summary */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-start justify-between mb-3">
            <h2 className="font-bold text-lg text-gray-900">{request.title}</h2>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              {statusSteps[currentStepIdx]?.emoji} {statusSteps[currentStepIdx]?.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{request.detail}</p>
          {request.photo_url && (
            <img src={request.photo_url} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
          )}
          <div className="grid grid-cols-2 gap-3 text-xs lg:text-sm pt-3 border-t border-gray-100">
            <div>
              <p className="text-gray-500 mb-1">📍 Lokasi</p>
              <p className="text-gray-900 font-medium">{request.location}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">🕒 Jadwal</p>
              <p className="text-gray-900 font-medium">{request.schedule}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">💰 Budget</p>
              <p className="text-green-700 font-bold">{formatPrice(request.budget)}</p>
            </div>
            {request.final_price && (
              <div>
                <p className="text-gray-500 mb-1">💵 Harga Final</p>
                <p className="text-green-700 font-bold">{formatPrice(request.final_price)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Tracking */}
        {request.status !== 'searching' && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Status Pekerjaan</h3>
            <div className="space-y-4">
              {statusSteps.slice(1).map((step, idx) => {
                const stepIdx = idx + 1;
                const completed = currentStepIdx >= stepIdx;
                const current = currentStepIdx === stepIdx;
                return (
                  <div key={step.id} className="flex gap-3 items-center" data-testid={`status-${step.id}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${
                      completed ? 'bg-green-700' : 'bg-gray-200'
                    }`}>
                      {completed ? <CheckCircle2 size={18} className="text-white" /> : <span className="text-sm">{step.emoji}</span>}
                    </div>
                    <p className={`flex-1 font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    {current && (
                      <Loader2 size={16} className="text-green-700 animate-spin" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Helper Card */}
        {selectedOffer && (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Helper Anda</h3>
            <div className="flex gap-4 items-center">
              <img src={selectedOffer.helper_photo} alt={selectedOffer.helper_name} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-bold text-gray-900">{selectedOffer.helper_name}</p>
                <div className="flex items-center gap-1 text-sm text-yellow-500 mt-1">
                  <Star size={14} fill="currentColor" />
                  <span className="text-gray-900 font-medium">{selectedOffer.rating}</span>
                  <span className="text-gray-500">({selectedOffer.reviews_count})</span>
                </div>
                <p className="text-sm text-green-700 font-bold mt-1">{formatPrice(selectedOffer.price)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200">
                  <Phone size={16} />
                </button>
                <button className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-200">
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Helper Offers (when status = searching) */}
        {request.status === 'searching' && offers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 lg:mb-4">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <h3 className="font-bold text-gray-900">
                {offers.length} Helper Mengajukan Penawaran
              </h3>
            </div>
            <div className="space-y-3" data-testid="offers-list">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-xl shadow-sm p-4 lg:p-5" data-testid={`offer-${offer.id}`}>
                  <div className="flex gap-3 mb-3">
                    <img src={offer.helper_photo} alt={offer.helper_name} className="w-14 h-14 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-900">{offer.helper_name}</p>
                          <div className="flex items-center gap-1 text-sm text-yellow-500 mt-0.5">
                            <Star size={13} fill="currentColor" />
                            <span className="text-gray-900 font-medium">{offer.rating}</span>
                            <span className="text-gray-500 text-xs">({offer.reviews_count})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Penawaran</p>
                          <p className="font-bold text-green-700 text-lg">{formatPrice(offer.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {offer.distance} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {offer.eta_minutes} menit
                        </span>
                      </div>
                      {offer.note && (
                        <p className="text-xs text-gray-600 mt-2 italic">"{offer.note}"</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleSelectHelper(offer.id)}
                    disabled={processing}
                    className="w-full bg-green-700 text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition disabled:bg-gray-400 text-sm"
                    data-testid={`select-offer-${offer.id}`}
                  >
                    Pilih Helper Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons based on status */}
        {request.status === 'helper_selected' && (
          <button
            onClick={() => handleAdvanceStatus('on_the_way')}
            disabled={processing}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
            data-testid="advance-on-the-way"
          >
            Demo: Helper Berangkat ke Lokasi
          </button>
        )}
        {request.status === 'on_the_way' && (
          <button
            onClick={() => handleAdvanceStatus('in_progress')}
            disabled={processing}
            className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
            data-testid="advance-in-progress"
          >
            Demo: Helper Mulai Bekerja
          </button>
        )}
        {request.status === 'in_progress' && (
          <button
            onClick={() => handleAdvanceStatus('completed')}
            disabled={processing}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            data-testid="complete-button"
          >
            <CheckCircle2 size={20} />
            Tandai Selesai & Bayar
          </button>
        )}
        {request.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <p className="font-bold text-gray-900 mb-1">Pekerjaan Selesai!</p>
            <p className="text-sm text-gray-600 mb-4">Dana sudah diteruskan ke helper. Terima kasih!</p>
            <button
              onClick={() => navigate('/bantuin')}
              className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800"
            >
              Buat Request Lainnya
            </button>
          </div>
        )}

        {/* Escrow Notice */}
        {request.status !== 'completed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck size={20} className="text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">🛡️ Pembayaran Aman</p>
              <p className="text-xs text-gray-600 mt-1">
                Dana ditahan Dibantu dan dicairkan ke helper setelah Anda klik "Selesai".
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BantuinDetailPage;
