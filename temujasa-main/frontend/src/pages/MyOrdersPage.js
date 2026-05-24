import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Bookmark, MapPin, ChevronRight, Bell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import { getOrders } from '../api/api';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  useEffect(() => {
    if (location.state?.message) {
      alert(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (activeTab === 'active') {
        const allOrders = await getOrders();
        setOrders(allOrders.filter(o => ['pending', 'confirmed', 'in_progress'].includes(o.status)));
      } else if (activeTab === 'completed') {
        setOrders(await getOrders('completed'));
      } else {
        setOrders(await getOrders('cancelled'));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(price);

  const formatDate = (s) => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const getStatusInfo = (status) => ({
    pending: { label: 'Menunggu Konfirmasi Teknisi', color: 'bg-amber-100 text-amber-800', borderColor: 'border-amber-200', icon: Clock },
    confirmed: { label: 'Teknisi Sedang Menuju Lokasi', color: 'bg-amber-100 text-amber-800', borderColor: 'border-amber-200', icon: Clock },
    in_progress: { label: 'Pekerjaan Sedang Berlangsung', color: 'bg-orange-100 text-orange-800', borderColor: 'border-orange-200', icon: Clock },
    completed: { label: 'Selesai', color: 'bg-green-100 text-green-800', borderColor: 'border-green-200', icon: CheckCircle },
    cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', borderColor: 'border-red-200', icon: XCircle }
  }[status] || { label: 'Pending', color: 'bg-gray-100 text-gray-800', borderColor: 'border-gray-200', icon: Clock });

  const OrderCard = ({ order }) => {
    const statusInfo = getStatusInfo(order.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div
        onClick={() => navigate(`/order-detail/${order.id}`)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 lg:p-5 cursor-pointer transition card-hover"
        data-testid={`order-card-${order.id}`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">#{order.order_number}</span>
          </div>
          <button onClick={(e) => e.stopPropagation()} className="text-gray-400 hover:text-green-700">
            <Bookmark size={18} />
          </button>
        </div>

        <div className="flex gap-3 mb-3">
          <img src={order.technician_photo} alt={order.technician_name} className="w-14 h-14 lg:w-16 lg:h-16 rounded-lg object-cover" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm lg:text-base mb-1">{order.service_name}</h4>
            {activeTab !== 'completed' && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] lg:text-xs font-medium ${statusInfo.color} border ${statusInfo.borderColor}`}>
                <StatusIcon size={12} />
                <span>{statusInfo.label}</span>
              </div>
            )}
            {activeTab === 'completed' && (
              <p className="text-xs lg:text-sm text-gray-600">Selesai • {formatDate(order.created_at)}</p>
            )}
            {activeTab !== 'completed' && order.status === 'confirmed' && (
              <p className="text-[10px] lg:text-xs text-gray-500 mt-1">Estimasi tiba dalam 15 menit</p>
            )}
            {activeTab !== 'completed' && order.status === 'pending' && (
              <p className="text-[10px] lg:text-xs text-gray-500 mt-1">Teknisi akan konfirmasi jadwal kedatangan</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img src={order.technician_photo} alt={order.technician_name} className="w-6 h-6 rounded-full" />
            <div>
              <p className="text-xs lg:text-sm font-medium text-gray-900">{order.technician_name}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                <MapPin size={10} />
                <span>2.1 km dari lokasi Anda</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] lg:text-xs text-gray-500">Total</p>
            <p className="font-bold text-gray-900 text-sm lg:text-base">{formatPrice(order.total)}</p>
          </div>
        </div>

        {activeTab === 'completed' && (
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/rating/${order.id}`); }}
            className="w-full mt-3 bg-white border-2 border-green-700 text-green-700 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition"
            data-testid={`rate-order-${order.id}`}
          >
            Beri Penilaian
          </button>
        )}

        {activeTab === 'active' && (
          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              if (order.status === 'in_progress') {
                navigate(`/order-tracking/${order.id}`);
              } else {
                navigate(`/order-detail/${order.id}`);
              }
            }}
            className="w-full mt-3 flex items-center justify-center gap-1 text-green-700 py-2 text-sm font-semibold hover:underline"
          >
            Lihat Detail <ChevronRight size={14} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      <DesktopNav />
      {/* Header */}
      <header className="lg:hidden bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="lg:hidden p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-bold text-lg lg:text-2xl text-gray-900">Pesanan Saya</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} className="text-gray-700" />
            </button>
            <button onClick={() => navigate('/')} className="text-green-700 font-medium text-sm">Kembali ke Beranda</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 lg:mb-6">
          <div className="flex">
            {[
              { id: 'active', label: 'Aktif' },
              { id: 'completed', label: 'Selesai' },
              { id: 'cancelled', label: 'Dibatalkan' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 lg:py-4 text-sm lg:text-base font-semibold transition relative ${
                  activeTab === tab.id ? 'text-green-700' : 'text-gray-500 hover:text-gray-700'
                }`}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-green-700 rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5" data-testid="orders-list">
            {orders.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 mb-4">
              {activeTab === 'active' && 'Belum ada pesanan aktif'}
              {activeTab === 'completed' && 'Belum ada pesanan selesai'}
              {activeTab === 'cancelled' && 'Belum ada pesanan dibatalkan'}
            </p>
            <button onClick={() => navigate('/')} className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition">
              Mulai Pesan
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MyOrdersPage;
