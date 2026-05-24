import React from 'react';
import { Star } from 'lucide-react';

const ReviewFeed = () => {
  // Mock reviews - anonymous with area only
  const reviews = [
    { id: 1, rating: 5, text: "AC jadi dingin lagi, cepat dan rapi.", area: "Depok", service: "Cuci AC" },
    { id: 2, rating: 5, text: "Teknisi ramah dan profesional.", area: "Bekasi", service: "Perbaikan Listrik" },
    { id: 3, rating: 5, text: "Harga sesuai, hasil memuaskan.", area: "Tangerang", service: "Service Plumbing" },
    { id: 4, rating: 4, text: "Pekerjaan bagus, cuma agak lama.", area: "Jakarta Selatan", service: "Cleaning" },
    { id: 5, rating: 5, text: "Sangat membantu, recommended!", area: "Bogor", service: "Pest Control" },
    { id: 6, rating: 5, text: "Teknisi datang tepat waktu.", area: "Depok", service: "Makeup Wisuda" },
  ];

  return (
    <section className="mb-6 lg:mb-10" data-testid="review-feed-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-base lg:text-2xl font-bold text-gray-900">Review Terbaru</h2>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">Dari pengguna di sekitar Anda</p>
        </div>
      </div>

      {/* Review cards - horizontal scroll on mobile */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm p-4 min-w-[280px] snap-start border border-gray-100"
            data-testid={`review-${review.id}`}
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              "{review.text}"
            </p>

            {/* Attribution - anonymous */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold">— User {review.area}</span>
              <span className="text-green-600">{review.service}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition"
            data-testid={`review-desktop-${review.id}`}
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              "{review.text}"
            </p>

            {/* Attribution */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <span className="font-semibold">— User {review.area}</span>
              <span className="text-green-600">{review.service}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewFeed;
