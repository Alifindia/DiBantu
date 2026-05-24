import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Wallet, Camera, Sparkles, ShieldCheck } from 'lucide-react';
import { createBantuin } from '../api/api';

const BantuinFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialTitle = location.state?.title || '';

  const [title, setTitle] = useState(initialTitle);
  const [detail, setDetail] = useState('');
  const [locationField, setLocationField] = useState('Jl. Melati No.10, Depok');
  const [schedule, setSchedule] = useState('Secepatnya');
  const [budget, setBudget] = useState(75000);
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);

  // Validation for forbidden keywords
  const validateRequest = () => {
    const combined = `${title} ${detail}`.toLowerCase();
    
    const safetyKeywords = [
      'jemput anak', 'antar anak', 'antar orang', 'jemput orang',
      'babysitter', 'jaga anak', 'rawat orang', 'caregiver', 'baby sitter',
      'driver pribadi', 'bodyguard', 'pengawal',
      'menemani anak', 'menjaga anak', 'mengawasi anak',
      'antar jemput', 'antarin', 'jemputin',
      'pendamping lansia', 'merawat lansia',
      'perawat', 'medis', 'dokter', 'suster'
    ];
    
    const technicalKeywords = [
      'tukang las', 'service ac', 'ac tidak dingin', 'isi freon',
      'listrik', 'kelistrikan', 'instalasi listrik',
      'plumbing', 'tukang ledeng', 'pipa bocor', 'saluran mampet',
      'cctv', 'pasang cctv', 'instalasi cctv',
      'pest control', 'anti rayap', 'basmi rayap', 'fogging',
      'smart home', 'smart lock'
    ];
    
    for (const keyword of safetyKeywords) {
      if (combined.includes(keyword)) {
        return {
          valid: false,
          message: 'Maaf, request ini belum bisa diproses melalui Bantuin karena termasuk layanan berisiko tinggi atau melibatkan keselamatan orang. Silakan pilih bantuan ringan lainnya.'
        };
      }
    }
    
    for (const keyword of technicalKeywords) {
      if (combined.includes(keyword)) {
        return {
          valid: false,
          message: 'Layanan ini tersedia di kategori utama BeBantu. Silakan pilih kategori yang sesuai agar ditangani oleh teknisi profesional.'
        };
      }
    }
    
    return { valid: true };
  };

  const handleSubmit = async () => {
    if (!title.trim() || !detail.trim()) {
      alert('Mohon isi judul dan detail pekerjaan');
      return;
    }
    
    // Validate request
    const validation = validateRequest();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    
    try {
      setSubmitting(true);
      const req = await createBantuin({
        title: title.trim(),
        detail: detail.trim(),
        location: locationField,
        schedule,
        budget: parseInt(budget),
        photo_url: photoUrl
      });
      navigate(`/bantuin/request/${req.id}`);
    } catch (e) {
      console.error(e);
      // Check if error is from backend validation
      if (e.response && e.response.data && e.response.data.detail) {
        alert(e.response.data.detail);
      } else {
        alert('Gagal membuat request. Coba lagi.');
      }
      setSubmitting(false);
    }
  };

  const budgetOptions = [50000, 75000, 100000, 150000, 200000, 300000];
  const scheduleOptions = ['Secepatnya', 'Hari ini', 'Besok', 'Pilih jadwal'];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-green-700" />
            <h1 className="font-bold text-lg text-gray-900">Buat Request</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 lg:py-8 space-y-4 lg:space-y-5">
        {/* Title */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Judul Request <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Antri beli sushi Tako"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="title-input"
          />
        </div>

        {/* Detail */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Detail Pekerjaan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={4}
            placeholder="Jelaskan kebutuhan Anda secara detail..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800 resize-none"
            data-testid="detail-textarea"
          />
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-green-700" />
            Lokasi
          </label>
          <input
            type="text"
            value={locationField}
            onChange={(e) => setLocationField(e.target.value)}
            placeholder="Alamat lengkap..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="location-input"
          />
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Calendar size={16} className="text-green-700" />
            Jadwal
          </label>
          <div className="flex flex-wrap gap-2">
            {scheduleOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSchedule(opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  schedule === opt
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                }`}
                data-testid={`schedule-${opt}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Wallet size={16} className="text-green-700" />
            Budget Anda
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {budgetOptions.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  budget === b
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                }`}
                data-testid={`budget-${b}`}
              >
                {formatPrice(b)}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value) || 0)}
            placeholder="Budget custom"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800 text-sm"
            data-testid="custom-budget-input"
          />
          <p className="text-xs text-gray-500 mt-2">Helper akan mengajukan penawaran sesuai budget Anda.</p>
        </div>

        {/* Photo (Optional) */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Foto (Opsional)
          </label>
          <button
            onClick={() => setPhotoUrl(photoUrl ? '' : 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400')}
            className="w-full border-2 border-dashed border-gray-300 hover:border-green-400 rounded-xl p-6 flex flex-col items-center gap-2 transition"
            data-testid="upload-photo-button"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
            ) : (
              <>
                <Camera size={32} className="text-gray-400" />
                <p className="text-sm text-gray-500">Tap untuk upload foto</p>
                <p className="text-xs text-gray-400">PNG, JPG (max 5MB)</p>
              </>
            )}
          </button>
          {photoUrl && (
            <button
              onClick={() => setPhotoUrl('')}
              className="text-xs text-red-500 mt-2 hover:underline"
            >
              Hapus foto
            </button>
          )}
        </div>

        {/* Security */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck size={20} className="text-green-700 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">🛡️ Pembayaran Aman</p>
            <p className="text-xs text-gray-600 mt-1">
              Dana ditahan aplikasi dan baru dicairkan ke helper setelah pekerjaan selesai.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg" style={{ zIndex: 999 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !detail.trim()}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
          data-testid="submit-button"
        >
          <Sparkles size={18} />
          {submitting ? 'Mencari Helper...' : 'Cari Helper'}
        </button>
      </div>

      <div className="hidden lg:block max-w-3xl mx-auto px-4 lg:px-8 pb-8">
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !detail.trim()}
          className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-lg"
          data-testid="submit-button-desktop"
        >
          <Sparkles size={20} />
          {submitting ? 'Mencari Helper...' : 'Cari Helper'}
        </button>
      </div>
    </div>
  );
};

export default BantuinFormPage;
