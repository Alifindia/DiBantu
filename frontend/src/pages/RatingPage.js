import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';
import { getOrder, createReview } from '../api/api';

const RatingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [orderId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Silakan pilih rating terlebih dahulu');
      return;
    }
    try {
      setSubmitting(true);
      await createReview({
        order_id: orderId,
        technician_id: order.technician_id,
        rating,
        comment: comment || ''
      });
      setSubmitted(true);
      setTimeout(() => navigate('/my-orders'), 2000);
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.detail || 'Gagal mengirim penilaian';
      alert(msg);
      setSubmitting(false);
    }
  };

  const getRatingLabel = (r) => ({1:'Sangat Kurang',2:'Kurang',3:'Cukup',4:'Puas',5:'Sangat Puas'}[r] || '');

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="w-24 h-24 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={56} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terima Kasih!</h2>
          <p className="text-gray-600 mb-2">Penilaian Anda telah berhasil dikirim.</p>
          <p className="text-sm text-gray-500">Mengarahkan ke halaman pesanan...</p>
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
          <h1 className="font-bold text-lg text-gray-900">Pekerjaan Selesai</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-4 lg:space-y-6">
        {/* Success Indicator */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8 text-center">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} className="lg:w-14 lg:h-14" />
          </div>
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">Pekerjaan Selesai!</h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-md mx-auto">
            Silakan periksa hasil pekerjaan dan berikan penilaian Anda.
          </p>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
          <h3 className="font-bold text-gray-900 text-center mb-5 lg:text-lg">
            Beri Penilaian untuk {order.technician_name}
          </h3>

          <div className="flex justify-center gap-2 lg:gap-3 mb-4" data-testid="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition transform hover:scale-110"
                data-testid={`star-${star}`}
              >
                <Star
                  size={44}
                  className={`lg:w-12 lg:h-12 ${star <= (hoveredRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>

          <p className="text-center font-semibold text-gray-900 text-lg" data-testid="rating-label">
            {getRatingLabel(hoveredRating || rating)}
          </p>
        </div>

        {/* Review Text */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tulis ulasan (opsional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 200))}
            placeholder="AC sudah dingin lagi, teknisi ramah & profesional. Terima kasih!"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 resize-none text-sm lg:text-base"
            data-testid="review-textarea"
          />
          <p className="text-xs text-gray-500 text-right mt-1">{comment.length}/200</p>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs lg:text-sm text-gray-700">
            💰 Dana akan diteruskan ke teknisi setelah Anda mengonfirmasi.
          </p>
        </div>

        {/* Desktop Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="hidden lg:block w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
          data-testid="submit-rating-button-desktop"
        >
          {submitting ? 'Mengirim...' : 'Konfirmasi & Selesaikan'}
        </button>
      </div>

      {/* Mobile Submit */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition disabled:bg-gray-400"
          data-testid="submit-rating-button"
        >
          {submitting ? 'Mengirim...' : 'Konfirmasi & Selesaikan'}
        </button>
      </div>
    </div>
  );
};

export default RatingPage;
