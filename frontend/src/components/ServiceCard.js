import React from 'react';

const ServiceCard = ({ service, onClick }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition card-hover"
      data-testid={`service-card-${service.id}`}
    >
      <div className="flex gap-4">
        <img
          src={service.image_url}
          alt={service.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Mulai dari</span>
            <span className="font-bold text-green-700">{formatPrice(service.base_price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;