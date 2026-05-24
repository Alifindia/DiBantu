import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Phone, MessageCircle, Headphones } from 'lucide-react';
import { getOrder, updateOrderStatus } from '../api/api';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [orderId]);

  const handleCompleteJob = async () => {
    try {
      setCompleting(true);
      await updateOrderStatus(orderId, 'completed', 'Pekerjaan selesai');
      navigate(`/rating/${orderId}`);
    } catch (e) {
      console.error(e);
      alert('Gagal menyelesaikan pekerjaan');
      setCompleting(false);
    }
  };

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
          <button onClick={() => navigate('/my-orders')} className="bg-green-700 text-white px-6 py-2 rounded-lg">Kembali</button>
        </div>
      </div>
    );
  }

  const steps = [
    { label: 'Teknisi telah tiba di lokasi', time: '10:32', completed: true },
    { label: 'Pemeriksaan & Diagnosa', time: '10:35', completed: true },
    { label: 'Pekerjaan Sedang Berlangsung', time: '10:40', completed: true, current: true },
    { label: 'Pekerjaan Selesai', time: '', completed: false },
    { label: 'Menunggu Konfirmasi Anda', time: '', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Pekerjaan Berlangsung</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 lg:space-y-5">
            {/* Status Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 lg:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Pekerjaan Sedang Berlangsung</p>
                  <p className="text-xs lg:text-sm text-gray-600">Mohon tunggu hingga teknisi menyelesaikan pekerjaan.</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-5 lg:p-6">
              <h3 className="font-bold text-gray-900 mb-5 lg:text-lg">Timeline Pekerjaan</h3>
              <div className="space-y-4 lg:space-y-5">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4" data-testid={`timeline-event-${idx}`}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${
                        step.completed ? 'bg-green-700' : step.current ? 'bg-amber-500' : 'bg-gray-200'
                      }`}>
                        {step.completed ? (
                          <CheckCircle size={18} className="text-white" />
                        ) : step.current ? (
                          <Clock size={18} className="text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`w-0.5 h-10 lg:h-12 my-1 ${step.completed ? 'bg-green-700' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2 flex justify-between items-start">
                      <p className={`font-medium text-sm lg:text-base ${step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {step.time && (
                        <span className="text-xs lg:text-sm text-gray-500">{step.time}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Complete Button */}
            <button
              onClick={handleCompleteJob}
              disabled={completing}
              className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
              data-testid="complete-job-button"
            >
              {completing ? 'Memproses...' : 'Tandai Pekerjaan Selesai (Demo)'}
            </button>
          </div>

          {/* Sidebar */}
          <aside className="mt-4 lg:mt-0 space-y-4">
            {/* Technician Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
              <div className="flex items-center gap-4">
                <img src={order.technician_photo} alt={order.technician_name} className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{order.technician_name}</h3>
                  <p className="text-xs lg:text-sm text-gray-600">Spesialis AC</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200 transition">
                    <Phone size={16} />
                  </button>
                  <button className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-200 transition">
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Headphones className="text-blue-700" size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Butuh Bantuan?</p>
                  <button className="text-xs text-blue-700 font-medium hover:underline">
                    Hubungi CS BeBantu
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
