import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, technician } = location.state || {};

  const [transportationFee] = useState(technician?.transportation_fee_min || 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = (service?.base_price || 0) + transportationFee;

  const handleContinue = () => {
    navigate('/payment', {
      state: { service, technician, address: 'Rumah Saya, Jl. Melati No.10, Depok', schedule: 'Secepatnya', transportationFee, total }
    });
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
          <h1 className="font-bold text-lg text-gray-900">Ringkasan Pesanan</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3 lg:space-y-5">
            {/* Service Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h3 className="text-xs lg:text-sm font-semibold text-gray-500 mb-3">Layanan</h3>
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-3 lg:gap-4 flex-1">
                  <img src={service.image_url} alt={service.name} className="w-14 h-14 lg:w-20 lg:h-20 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm lg:text-base">{service.name}</h4>
                    <p className="text-xs lg:text-sm text-gray-600 mt-1">1 Unit</p>
                  </div>
                </div>
                <span className="font-bold text-green-700 text-sm lg:text-base">{formatPrice(service.base_price)}</span>
              </div>
            </div>

            {/* Technician Info */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h3 className="text-xs lg:text-sm font-semibold text-gray-500 mb-3">Teknisi</h3>
              <div className="flex gap-3 lg:gap-4">
                <img src={technician.photo_url} alt={technician.name} className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{technician.name}</h4>
                      <p className="text-xs lg:text-sm text-gray-600">{technician.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                        <span className="text-sm font-medium">{technician.rating}</span>
                        <span className="text-xs text-gray-500">({technician.reviews_count} ulasan)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] lg:text-xs text-gray-500">Biaya Transportasi</p>
                      <p className="font-bold text-green-700 text-sm lg:text-base">{formatPrice(transportationFee)}</p>
                      <p className="text-[10px] lg:text-xs text-gray-500 mt-1">
                        {formatPrice(technician.transportation_fee_min)} - {formatPrice(technician.transportation_fee_max)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs lg:text-sm font-semibold text-gray-500">Alamat Layanan</h3>
                <button className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1">
                  Ubah <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-green-700" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Rumah Saya</p>
                  <p className="text-xs lg:text-sm text-gray-600 mt-0.5">Jl. Melati No.10, Depok</p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h3 className="text-xs lg:text-sm font-semibold text-gray-500 mb-3">Jadwal Kunjungan</h3>
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="text-green-700" size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Secepatnya</p>
                  <p className="text-xs lg:text-sm text-gray-600 mt-0.5">Akan dikonfirmasi oleh teknisi</p>
                </div>
              </div>
            </div>

            {/* Payment Details - Mobile show inline, Desktop in sidebar */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-3">Rincian Pembayaran</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Jasa Servis</span>
                  <span className="font-medium">{formatPrice(service.base_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Transportasi</span>
                  <span className="font-medium">{formatPrice(transportationFee)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Pembayaran</span>
                    <span className="font-bold text-green-700 text-lg">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar: Payment Summary */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Rincian Pembayaran</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Jasa Servis</span>
                  <span className="font-medium text-gray-900">{formatPrice(service.base_price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya Transportasi</span>
                  <span className="font-medium text-gray-900">{formatPrice(transportationFee)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Pembayaran</span>
                    <span className="font-bold text-green-700 text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full mt-6 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                data-testid="continue-to-payment-button-desktop"
              >
                Lanjut ke Pembayaran
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Continue Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleContinue}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
          data-testid="continue-to-payment-button"
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
