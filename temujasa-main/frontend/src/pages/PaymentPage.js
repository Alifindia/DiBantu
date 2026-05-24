import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Wallet, Lock, ShieldCheck, Truck, CheckCircle2, DollarSign } from 'lucide-react';
import { createOrder } from '../api/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, technician, address, schedule, transportationFee, total } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('Bank Transfer / VA');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    { id: 'Bank Transfer / VA', name: 'Transfer Bank / VA', icon: Building2, color: 'text-blue-600' },
    { id: 'OVO', name: 'OVO', icon: Wallet, color: 'text-purple-600' },
    { id: 'GoPay', name: 'GoPay', icon: Wallet, color: 'text-cyan-600' },
    { id: 'Kartu Kredit / Debit', name: 'Kartu Kredit / Debit', icon: CreditCard, color: 'text-orange-600' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert('Pilih metode pembayaran terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        service_id: service.id,
        technician_id: technician.id,
        address,
        schedule,
        transportation_fee: transportationFee,
        payment_method: selectedMethod
      };

      const order = await createOrder(orderData);

      setTimeout(() => {
        navigate('/my-orders', {
          state: { message: 'Pesanan berhasil dibuat!', orderId: order.id }
        });
      }, 1500);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal membuat pesanan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  if (!service || !technician) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Data tidak lengkap</p>
          <button onClick={() => navigate('/')} className="bg-green-700 text-white px-6 py-2 rounded-lg">
            Kembali ke Home
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
          <h1 className="font-bold text-lg text-gray-900">Pembayaran</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Secure Payment Banner */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 lg:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-green-700" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Pembayaran Aman</h3>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Dana Anda ditahan oleh TemuJasa dan diteruskan ke teknisi setelah pekerjaan selesai dikonfirmasi.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Flow Visualization */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <div className="flex items-center justify-between gap-1 lg:gap-2">
                {[
                  { icon: Lock, label: 'Pesanan\nDibuat', active: true },
                  { icon: Truck, label: 'Teknisi\nDatang', active: false },
                  { icon: CheckCircle2, label: 'Pekerjaan\nSelesai', active: false },
                  { icon: DollarSign, label: 'Dana\nDiteruskan', active: false },
                ].map((step, idx, arr) => {
                  const Icon = step.icon;
                  return (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center mb-1 lg:mb-2 ${
                          step.active ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Icon size={16} className="lg:w-5 lg:h-5" />
                        </div>
                        <span className="text-[9px] lg:text-xs text-center text-gray-600 whitespace-pre-line leading-tight">
                          {step.label}
                        </span>
                      </div>
                      {idx < arr.length - 1 && (
                        <div className="flex-1 h-0.5 bg-gray-200 -mt-3 lg:-mt-5"></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-base lg:text-lg">Metode Pembayaran</h3>
              <div className="space-y-2 lg:space-y-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-3 lg:p-4 rounded-xl border-2 transition ${
                        isSelected ? 'border-green-700 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-white'
                      }`}
                      data-testid={`payment-method-${method.id}`}
                    >
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon size={20} className={method.color} />
                      </div>
                      <span className="font-medium text-gray-900 text-sm lg:text-base flex-1 text-left">{method.name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        isSelected ? 'border-green-700 bg-green-700' : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar (Desktop) / Inline (Mobile) */}
          <aside className="mt-4 lg:mt-0">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-md p-4 lg:p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">Ringkasan Pembayaran</h3>
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Pembayaran</p>
                  <p className="font-bold text-green-700 text-xl lg:text-2xl" data-testid="total-payment">{formatPrice(total)}</p>
                </div>
                <button className="text-sm text-green-700 font-medium lg:hidden">
                  Lihat Detail ▾
                </button>
              </div>
              <div className="hidden lg:block space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jasa Servis</span>
                  <span>{formatPrice(service.base_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Transportasi</span>
                  <span>{formatPrice(transportationFee)}</span>
                </div>
              </div>
              <button
                onClick={handlePayment}
                disabled={!selectedMethod || loading}
                className="hidden lg:block w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
                data-testid="pay-now-button-desktop"
              >
                {loading ? 'Memproses...' : 'Bayar Sekarang'}
              </button>
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                <Lock size={12} />
                <span>Data Anda aman dan dilindungi</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Pay Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || loading}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
          data-testid="pay-now-button"
        >
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
