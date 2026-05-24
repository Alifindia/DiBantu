import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Search, ChevronRight, ShieldCheck, Clock, FileText } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';

const BantuinPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const suggestions = [
    { emoji: '🍔', label: 'Antri makanan', desc: 'Beli makanan viral / antri panjang' },
    { emoji: '🔧', label: 'Tukang las', desc: 'Las pagar, kanopi, pintu besi' },
    { emoji: '📦', label: 'Angkut barang', desc: 'Pindahan, kirim barang' },
    { emoji: '🗑️', label: 'Buang puing', desc: 'Buang sisa renovasi, sampah besar' },
    { emoji: '📺', label: 'Pasang TV', desc: 'Pasang TV dinding, breket' },
    { emoji: '🎪', label: 'Helper event', desc: 'Bantu acara, pernikahan, ulang tahun' },
    { emoji: '🛒', label: 'Beli titipan', desc: 'Belanja kebutuhan dadakan' },
    { emoji: '🏠', label: 'Bantu pindahan', desc: 'Pindah rumah / kos' },
  ];

  const handleStartRequest = (title = '') => {
    navigate('/bantuin/new', { state: { title: title || query } });
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

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 rounded-2xl lg:rounded-3xl shadow-xl p-6 lg:p-10 text-white mb-6 lg:mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl lg:text-3xl font-extrabold leading-tight mb-1">
                Mau dibantu apa hari ini?
              </h2>
              <p className="text-sm lg:text-base text-green-50">
                Buat request bantuan custom sesuai kebutuhan Anda.
              </p>
            </div>
          </div>

          {/* Big Input */}
          <div className="bg-white rounded-xl lg:rounded-2xl p-1.5 lg:p-2 mt-4 lg:mt-6 shadow-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && query.trim() && handleStartRequest()}
                placeholder="Contoh: antriin makanan, tukang las..."
                className="flex-1 px-3 lg:px-4 py-2.5 lg:py-3 outline-none text-gray-800 text-sm lg:text-base"
                data-testid="bantuin-query-input"
              />
              <button
                onClick={() => handleStartRequest()}
                disabled={!query.trim()}
                className="bg-green-700 hover:bg-green-800 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-lg lg:rounded-xl font-semibold text-sm lg:text-base disabled:bg-gray-300 transition flex items-center gap-1"
                data-testid="bantuin-search-button"
              >
                <Search size={16} />
                <span className="hidden sm:inline">Cari</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mb-6 lg:mb-8 text-xs lg:text-sm">
          <div className="flex items-center gap-1.5 text-gray-600">
            <ShieldCheck size={14} className="text-green-700" />
            <span>Helper Terverifikasi</span>
          </div>
          <div className="w-px h-3 bg-gray-300" />
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock size={14} className="text-green-700" />
            <span>Respons Cepat</span>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="mb-4 lg:mb-6">
          <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-3 lg:mb-4">
            💡 Saran Cepat
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="suggestions-grid">
            {suggestions.map((s) => (
              <button
                key={s.label}
                onClick={() => handleStartRequest(s.label)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md p-4 text-left transition card-hover border border-gray-100 group"
                data-testid={`suggestion-${s.label}`}
              >
                <div className="text-3xl lg:text-4xl mb-2">{s.emoji}</div>
                <p className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-green-700 transition">
                  {s.label}
                </p>
                <p className="text-[11px] lg:text-xs text-gray-500 leading-tight">{s.desc}</p>
                <div className="flex items-center gap-1 text-green-700 text-xs font-semibold mt-2">
                  <span>Pesan</span>
                  <ChevronRight size={12} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl shadow-sm p-5 lg:p-6 mt-6">
          <h3 className="font-bold text-gray-900 mb-4 lg:text-lg">Cara Kerja Bantuin</h3>
          <div className="space-y-3">
            {[
              { num: 1, title: 'Buat Request', desc: 'Tulis kebutuhan, lokasi & budget' },
              { num: 2, title: 'Helper Mengajukan Penawaran', desc: 'Pilih helper sesuai preferensi' },
              { num: 3, title: 'Helper Datang & Bantu', desc: 'Pantau via tracking real-time' },
              { num: 4, title: 'Bayar Setelah Selesai', desc: 'Dana aman dengan sistem escrow' },
            ].map((step) => (
              <div key={step.num} className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                  <p className="text-xs text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default BantuinPage;
