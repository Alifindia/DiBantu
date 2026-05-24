import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Phone, MessageCircle, Navigation } from 'lucide-react';
import { getOrder, startConversation } from '../api/api';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [orderId]);

  const handleChat = async () => {
    try {
      const conv = await startConversation(order.technician_id);
      navigate(`/chat/${conv.id}`);
    } catch (e) { console.error(e); }
  };

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pesanan tidak ditemukan</p>
          <button onClick={() => navigate('/my-orders')} className="bg-green-700 text-white px-6 py-2 rounded-lg">
            Kembali ke Pesanan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Detail Pesanan</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 lg:space-y-5">
            {/* Map Mockup */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 lg:h-72 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 relative">
                {/* Simulated map elements */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-white rounded-2xl shadow-lg p-3 lg:p-4 flex items-center gap-3 max-w-xs">
                    <img src={order.technician_photo} alt="" className="w-10 h-10 lg:w-12 lg:h-12 rounded-full ring-2 ring-green-700" />
                    <div>
                      <p className="text-xs lg:text-sm font-bold text-gray-900">Teknisi sedang menuju lokasi Anda</p>
                      <p className="text-[10px] lg:text-xs text-green-700 font-semibold">Estimasi tiba 15 menit lagi</p>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow-md p-2">
                  <Navigation size={18} className="text-green-700" />
                </div>
              </div>
            </div>

            {/* Technician Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
              <div className="flex items-center gap-4">
                <img src={order.technician_photo} alt={order.technician_name} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{order.technician_name}</h3>
                  <p className="text-sm text-gray-600">Spesialis AC</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200 transition" data-testid="call-button">
                    <Phone size={18} />
                  </button>
                  <button onClick={handleChat} className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-200 transition" data-testid="chat-button">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <aside className="mt-4 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 space-y-4 lg:sticky lg:top-24">
              <h3 className="font-bold text-gray-900 lg:text-lg">Informasi Pesanan</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">No. Pesanan</span>
                  <span className="font-semibold text-gray-900" data-testid="order-number">#{order.order_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Layanan</span>
                  <span className="font-medium text-gray-900 text-right">{order.service_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Jadwal</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <Calendar size={14} className="text-gray-500" />
                    Hari ini, 10:30
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Alamat</span>
                  <span className="font-medium text-gray-900 text-right flex items-start gap-1 max-w-[60%]">
                    <MapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                    <span>{order.address}</span>
                  </span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total Pembayaran</span>
                  <span className="font-bold text-green-700 text-lg" data-testid="order-total">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 space-y-2">
                {order.status === 'in_progress' && (
                  <button
                    onClick={() => navigate(`/order-tracking/${order.id}`)}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition"
                    data-testid="view-progress-button"
                  >
                    Lihat Progress Pekerjaan
                  </button>
                )}
                {order.status === 'completed' && (
                  <button
                    onClick={() => navigate(`/rating/${order.id}`)}
                    className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                    data-testid="rate-technician-button"
                  >
                    Beri Penilaian
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'confirmed') && (
                  <button
                    onClick={() => navigate(`/order-tracking/${order.id}`)}
                    className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition mb-2"
                  >
                    Mulai Pekerjaan (Demo)
                  </button>
                )}
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <button
                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
                    data-testid="cancel-order-button"
                  >
                    Batalkan Pesanan
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
