import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, AlertTriangle, Calendar, DollarSign, Sparkles, ShieldCheck } from 'lucide-react';
import { createWarTiket } from '../api/api';

const WarTiketFormPage = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [platformLink, setPlatformLink] = useState('');
  const [ticketWarDatetime, setTicketWarDatetime] = useState('');
  const [ticketCategory, setTicketCategory] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [standbyFee, setStandbyFee] = useState(50000);
  const [successFee, setSuccessFee] = useState(100000);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (p) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(p);

  const handleSubmit = async () => {
    if (!eventName.trim() || !platformLink.trim() || !ticketWarDatetime || !ticketCategory.trim()) {
      alert('Mohon isi semua field yang wajib (*)');
      return;
    }

    try {
      setSubmitting(true);
      const req = await createWarTiket({
        event_name: eventName.trim(),
        platform_link: platformLink.trim(),
        ticket_war_datetime: ticketWarDatetime,
        ticket_category: ticketCategory.trim(),
        ticket_quantity: parseInt(ticketQuantity),
        max_price: parseInt(maxPrice),
        standby_fee: parseInt(standbyFee),
        success_fee: parseInt(successFee),
        notes: notes.trim()
      });
      alert('Request War Tiket berhasil dibuat! Helper akan standby sesuai jadwal.');
      navigate('/bantuin/my-requests');
    } catch (e) {
      console.error(e);
      alert('Gagal membuat request. Coba lagi.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-12">
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Ticket size={18} className="text-green-700" />
            <h1 className="font-bold text-lg text-gray-900">Bantu War Tiket</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 lg:py-8 space-y-4 lg:space-y-5">
        {/* Warning Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">⚠️ Penting!</p>
            <p className="text-xs text-gray-700 mt-1">
              Helper hanya membantu proses manual melalui platform resmi. <strong>TIDAK menggunakan bot, TIDAK bypass antrean, TIDAK minta password akun Anda.</strong> Dibantu dan helper tidak menjamin tiket pasti didapat.
            </p>
          </div>
        </div>

        {/* Event Name */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Event <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Contoh: Konser Coldplay Jakarta 2025"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="event-name-input"
          />
        </div>

        {/* Platform Link */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Link Platform Resmi <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={platformLink}
            onChange={(e) => setPlatformLink(e.target.value)}
            placeholder="https://www.tiket.com/event/coldplay-jakarta"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="platform-link-input"
          />
          <p className="text-xs text-gray-500 mt-2">Link resmi dari platform seperti Tiket.com, Loket.com, GoTix, dll.</p>
        </div>

        {/* Ticket War Datetime */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={16} className="text-green-700" />
            Tanggal & Jam Ticket War <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={ticketWarDatetime}
            onChange={(e) => setTicketWarDatetime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="datetime-input"
          />
        </div>

        {/* Ticket Category */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Kategori Tiket yang Diincar <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={ticketCategory}
            onChange={(e) => setTicketCategory(e.target.value)}
            placeholder="Contoh: Festival A, VIP, CAT 1"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="category-input"
          />
        </div>

        {/* Quantity */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Jumlah Tiket
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={ticketQuantity}
            onChange={(e) => setTicketQuantity(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="quantity-input"
          />
        </div>

        {/* Max Price */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign size={16} className="text-green-700" />
            Batas Harga Maksimal per Tiket
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="500000"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="max-price-input"
          />
          <p className="text-xs text-gray-500 mt-2">Helper akan berusaha checkout di bawah harga ini.</p>
        </div>

        {/* Standby Fee */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Biaya Standby Helper
          </label>
          <input
            type="number"
            value={standbyFee}
            onChange={(e) => setStandbyFee(e.target.value)}
            placeholder="50000"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="standby-fee-input"
          />
          <p className="text-xs text-gray-500 mt-2">Dibayar untuk waktu standby helper (bahkan jika tidak dapat tiket).</p>
        </div>

        {/* Success Fee */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Success Fee (Jika Berhasil)
          </label>
          <input
            type="number"
            value={successFee}
            onChange={(e) => setSuccessFee(e.target.value)}
            placeholder="100000"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800"
            data-testid="success-fee-input"
          />
          <p className="text-xs text-gray-500 mt-2">Bonus tambahan hanya jika helper berhasil checkout tiket.</p>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Catatan Khusus
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Informasi tambahan untuk helper..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 text-gray-800 resize-none"
            data-testid="notes-textarea"
          />
        </div>

        {/* Total Estimate */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-semibold text-gray-900 text-sm mb-2">💰 Estimasi Total</p>
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex justify-between">
              <span>Biaya Standby:</span>
              <span className="font-semibold">{formatPrice(standbyFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Success Fee (jika berhasil):</span>
              <span className="font-semibold">{formatPrice(successFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Harga Tiket (max {ticketQuantity}x):</span>
              <span className="font-semibold">{formatPrice(maxPrice * ticketQuantity)}</span>
            </div>
            <div className="border-t border-green-300 pt-1 mt-2 flex justify-between text-sm">
              <span className="font-bold">Total Maksimal:</span>
              <span className="font-bold text-green-700">{formatPrice(standbyFee + successFee + (maxPrice * ticketQuantity))}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">🚫 Larangan</p>
            <ul className="text-xs text-gray-700 mt-1 space-y-1 list-disc list-inside">
              <li>TIDAK menggunakan bot atau software otomatis</li>
              <li>TIDAK bypass antrean atau melanggar sistem platform</li>
              <li>TIDAK meminta password akun user</li>
              <li>TIDAK menggunakan kartu/payment milik user</li>
              <li>TIDAK menjamin pasti dapat tiket</li>
              <li>TIDAK mendukung scalping atau jual ulang ilegal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg" style={{ zIndex: 999 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || !eventName.trim() || !platformLink.trim() || !ticketWarDatetime || !ticketCategory.trim()}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
          data-testid="submit-button"
        >
          <Sparkles size={18} />
          {submitting ? 'Memproses...' : 'Buat Request War Tiket'}
        </button>
      </div>

      {/* Submit Button Desktop */}
      <div className="hidden lg:block max-w-3xl mx-auto px-4 lg:px-8 pb-8">
        <button
          onClick={handleSubmit}
          disabled={submitting || !eventName.trim() || !platformLink.trim() || !ticketWarDatetime || !ticketCategory.trim()}
          className="w-full bg-green-700 text-white py-3.5 rounded-xl font-bold hover:bg-green-800 transition disabled:bg-gray-400 flex items-center justify-center gap-2 text-lg"
          data-testid="submit-button-desktop"
        >
          <Sparkles size={20} />
          {submitting ? 'Memproses...' : 'Buat Request War Tiket'}
        </button>
      </div>
    </div>
  );
};

export default WarTiketFormPage;
