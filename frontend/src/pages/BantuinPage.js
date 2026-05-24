import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Search, ChevronRight, ShieldCheck, Clock, FileText, CreditCard, MapPin, TrendingUp, Star, Zap } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';

const BantuinPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // 9 Quick Request Cards - UPDATED
  const suggestions = [
    { icon: '🍔', label: 'Antriin Makanan', desc: 'Antri makanan viral atau antre panjang', helpers: '12 helper siap bantu' },
    { icon: '🛒', label: 'Beli Titipan', desc: 'Belanja kebutuhan harian atau barang titipan', helpers: '18 helper siap bantu' },
    { icon: '📦', label: 'Ambil Barang', desc: 'Ambil paket, dokumen, atau barang ringan', helpers: '15 helper siap bantu' },
    { icon: '📦', label: 'Bantu Angkut', desc: 'Angkat barang ringan atau pindahan kecil', helpers: '22 helper siap bantu' },
    { icon: '🗑️', label: 'Buang Barang', desc: 'Buang kardus, barang bekas, atau sampah besar ringan', helpers: '10 helper siap bantu' },
    { icon: '🎪', label: 'Helper Event', desc: 'Bantu acara, jaga booth, atau persiapan event ringan', helpers: '11 helper siap bantu' },
    { icon: '🏠', label: 'Cek Rumah / Kos', desc: 'Cek kondisi rumah, kos, lampu, atau kirim foto lokasi', helpers: '8 helper siap bantu' },
    { icon: '🎫', label: 'Bantu War Tiket', desc: 'Bantu standby dan beli tiket lewat platform resmi', helpers: '9 helper siap bantu', special: true },
    { icon: '✨', label: 'Request Lainnya', desc: 'Tulis kebutuhan bantuan ringan lainnya secara custom', helpers: 'Helper akan memberi penawaran' },
  ];

  // Mock data untuk "Sedang Ramai di Area Anda"
  const trendingRequests = [
    { type: 'Antriin makanan viral', count: 12, area: 'Depok' },
    { type: 'Bantu war tiket', count: 8, area: 'Jakarta Selatan' },
    { type: 'Beli titipan', count: 15, area: 'Tangerang' },
    { type: 'Bantu angkut ringan', count: 6, area: 'Bekasi' },
    { type: 'Helper event', count: 4, area: 'Jakarta Pusat' },
  ];

  // Mock data untuk "Helper di Sekitar Anda"
  const nearbyHelpers = [
    { id: 1, name: 'Andi Helper', photo: 'https://i.pravatar.cc/150?img=11', rating: 4.9, distance: 1.2, status: 'online' },
    { id: 2, name: 'Rina Helper', photo: 'https://i.pravatar.cc/150?img=5', rating: 4.8, distance: 1.5, status: 'online' },
    { id: 3, name: 'Budi Angkut', photo: 'https://i.pravatar.cc/150?img=17', rating: 4.7, distance: 1.8, status: 'online' },
    { id: 4, name: 'Dewi Helper', photo: 'https://i.pravatar.cc/150?img=9', rating: 4.9, distance: 2.1, status: 'siap' },
  ];

  const handleStartRequest = (title = '', isWarTiket = false) => {
    if (isWarTiket) {
      navigate('/bantuin/war-tiket');
    } else {
      navigate('/bantuin/new', { state: { title: title || query } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <DesktopNav />
      <header className="lg:hidden bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="lg:hidden p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-700 to-emerald-600 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <h1 className="font-bold text-lg lg:text-2xl text-gray-900">Bantuin</h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/bantuin/my-requests')}
            className="text-sm text-green-700 font-semibold hover:underline flex items-center gap-1"
            data-testid="my-requests-link"
          >
            <FileText size={14} />
            Permintaan Saya
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 rounded-3xl shadow-2xl p-6 lg:p-10 text-white mb-6 lg:mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl lg:text-4xl font-extrabold leading-tight mb-2">
                Mau dibantu apa hari ini?
              </h2>
              <p className="text-sm lg:text-base text-green-50">
                Cari helper untuk bantuan harian ringan di sekitar Anda.
              </p>
            </div>
          </div>

          {/* Big Input */}
          <div className="bg-white rounded-2xl p-1.5 lg:p-2 mt-6 shadow-xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && handleStartRequest()}
                placeholder="Contoh: antriin makanan, ambil barang, bantu angkut..."
                className="flex-1 px-4 lg:px-5 py-3 lg:py-4 outline-none text-gray-800 text-sm lg:text-base rounded-xl"
                data-testid="bantuin-query-input"
              />
              <button
                onClick={() => handleStartRequest()}
                disabled={!query.trim()}
                className="bg-green-700 hover:bg-green-800 text-white px-5 lg:px-7 py-3 lg:py-4 rounded-xl font-bold text-sm lg:text-base disabled:bg-gray-300 transition flex items-center gap-2 shadow-lg"
                data-testid="bantuin-search-button"
              >
                <Search size={18} />
                <span>Cari Helper</span>
              </button>
            </div>
          </div>

          {/* Trust badges - Inside Hero */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mt-6 text-xs lg:text-sm">
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
              <ShieldCheck size={16} className="text-white" />
              <span>Helper Terverifikasi</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
              <Zap size={16} className="text-white" />
              <span>Respon Cepat</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
              <CreditCard size={16} className="text-white" />
              <span>Pembayaran Aman</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
              <MapPin size={16} className="text-white" />
              <span>Tracking Real-time</span>
            </div>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl lg:text-3xl font-bold text-green-700">42</p>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">Helper Online</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl lg:text-3xl font-bold text-green-700">±5 Min</p>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">Rata-rata Respon</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl lg:text-3xl font-bold text-green-700">4.8⭐</p>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">Rating Helper</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <p className="text-2xl lg:text-3xl font-bold text-green-700">1,284+</p>
            <p className="text-xs lg:text-sm text-gray-600 mt-1">Request Selesai</p>
          </div>
        </div>

        {/* Quick Suggestions - 9 Cards */}
        <div className="mb-6 lg:mb-8">
          <h3 className="font-bold text-gray-900 text-base lg:text-xl mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-green-700" />
            Saran Cepat
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4" data-testid="suggestions-grid">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => handleStartRequest(s.label, s.special)}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-lg p-4 lg:p-5 text-left transition-all duration-200 border group ${
                  s.special 
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-white' 
                    : 'border-gray-100 hover:border-green-200'
                }`}
                data-testid={`suggestion-${s.label}`}
              >
                <div className="text-4xl lg:text-5xl mb-3">{s.icon}</div>
                <p className="font-bold text-gray-900 text-sm lg:text-base mb-1 group-hover:text-green-700 transition">
                  {s.label}
                </p>
                <p className="text-[11px] lg:text-xs text-gray-500 leading-tight mb-2">{s.desc}</p>
                <p className="text-[10px] lg:text-xs text-green-600 font-semibold">{s.helpers}</p>
                <div className="flex items-center gap-1 text-green-700 text-xs font-bold mt-2">
                  <span>Pesan</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sedang Ramai di Area Anda */}
        <div className="bg-white rounded-2xl shadow-sm p-5 lg:p-6 mb-6 lg:mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base lg:text-lg">
            <TrendingUp size={20} className="text-green-700" />
            Sedang Ramai di Area Anda
          </h3>
          <div className="space-y-3">
            {trendingRequests.map((req, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{req.type}</p>
                  <p className="text-xs text-gray-500">{req.area}</p>
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  {req.count} request
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Helper di Sekitar Anda */}
        <div className="bg-white rounded-2xl shadow-sm p-5 lg:p-6 mb-6 lg:mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base lg:text-lg">
            <MapPin size={20} className="text-green-700" />
            Helper di Sekitar Anda
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {nearbyHelpers.map((helper) => (
              <div key={helper.id} className="bg-gray-50 rounded-xl p-3 text-center hover:shadow-md transition">
                <img src={helper.photo} alt={helper.name} className="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
                <p className="font-semibold text-gray-900 text-sm">{helper.name}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mt-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span>{helper.rating}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">📍 {helper.distance} km</p>
                <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold capitalize">
                  {helper.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cara Kerja Bantuin - Timeline Horizontal Modern */}
        <div className="bg-white rounded-2xl shadow-sm p-5 lg:p-6 mb-6 lg:mb-8">
          <h3 className="font-bold text-gray-900 mb-6 text-base lg:text-lg text-center">Cara Kerja Bantuin</h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { num: 1, icon: '📝', title: 'Request', desc: 'Buat permintaan bantuan ringan sesuai kebutuhan Anda' },
              { num: 2, icon: '👥', title: 'Helper Apply', desc: 'Helper sekitar akan mengajukan penawaran' },
              { num: 3, icon: '📍', title: 'Tracking', desc: 'Pilih helper dan pantau prosesnya real-time' },
              { num: 4, icon: '✅', title: 'Selesai', desc: 'Konfirmasi selesai dan beri penilaian' },
            ].map((step, idx) => (
              <div key={step.num} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 text-green-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
                  {step.icon}
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">{step.title}</p>
                <p className="text-xs text-gray-500 leading-tight">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-green-200 -z-10" style={{ width: 'calc(100% - 4rem)', left: 'calc(50% + 2rem)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Section - Payment & Safety */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 lg:mb-8">
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <ShieldCheck size={24} className="text-green-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Pembayaran Aman</p>
              <p className="text-xs text-gray-600">Dana ditahan aplikasi sampai bantuan selesai</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <Star size={24} className="text-green-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Helper Terverifikasi</p>
              <p className="text-xs text-gray-600">Helper melalui proses verifikasi dan rating</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <MapPin size={24} className="text-green-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Tracking Real-time</p>
              <p className="text-xs text-gray-600">Pantau helper dari perjalanan hingga selesai</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-5 flex items-start gap-3">
            <Clock size={24} className="text-green-700 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">CS Siap Bantu</p>
              <p className="text-xs text-gray-600">Bantuan jika ada kendala</p>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BantuinPage;
