import React from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';

const TechnicianCard = ({ technician, selected, onSelect }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition card-hover ${
        selected ? 'ring-2 ring-green-700' : ''
      }`}
      data-testid={`technician-card-${technician.id}`}
    >
      <div className="flex gap-4">
        <img
          src={technician.photo_url}
          alt={technician.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{technician.name}</h3>
            {technician.verified && (
              <CheckCircle size={16} className="text-green-700" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{technician.specialization}</p>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <span className="text-gray-900 font-medium">{technician.rating}</span>
              <span className="text-gray-500">({technician.reviews_count} ulasan)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{technician.distance} km dari lokasi Anda</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Biaya Transportasi</span>
            <span className="text-sm font-bold text-green-700">
              {formatPrice(technician.transportation_fee_min)} - {formatPrice(technician.transportation_fee_max)}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border-2 ${
            selected ? 'border-green-700 bg-green-700' : 'border-gray-300'
          } flex items-center justify-center`}>
            {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;