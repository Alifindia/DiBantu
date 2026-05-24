import React from 'react';
import { Zap, Users } from 'lucide-react';

const TechniciansOnline = () => {
  // Online partners by category
  const onlineByCategory = [
    { category: 'AC', count: 8, avgResponse: 5, icon: '❄️', color: 'from-blue-50 to-white border-blue-200' },
    { category: 'Listrik & CCTV', count: 12, avgResponse: 7, icon: '⚡', color: 'from-yellow-50 to-white border-yellow-200' },
    { category: 'Plumbing', count: 6, avgResponse: 10, icon: '💧', color: 'from-cyan-50 to-white border-cyan-200' },
    { category: 'Cleaning & Pest', count: 15, avgResponse: 8, icon: '✨', color: 'from-purple-50 to-white border-purple-200' },
    { category: 'Renovasi', count: 9, avgResponse: 12, icon: '🔨', color: 'from-orange-50 to-white border-orange-200' },
    { category: 'Pindahan & Angkut', count: 7, avgResponse: 15, icon: '🚚', color: 'from-teal-50 to-white border-teal-200' },
  ];

  return (
    <section className="mb-6 lg:mb-8" data-testid="technicians-online-section">
      {/* Header */}
      <div className="mb-3 lg:mb-4">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="text-green-600" size={24} />
          Mitra Aktif Sekarang
        </h2>
        <p className="text-xs lg:text-sm text-gray-500 mt-1">Siap melayani kebutuhan Anda dengan cepat</p>
      </div>

      {/* Horizontal carousel - mobile & desktop */}
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x no-scrollbar">
        {onlineByCategory.map((item) => (
          <div
            key={item.category}
            className={`bg-gradient-to-br ${item.color} border rounded-xl lg:rounded-2xl p-4 min-w-[160px] lg:min-w-[180px] snap-start flex-shrink-0 shadow-sm hover:shadow-md transition`}
            data-testid={`online-${item.category}`}
          >
            {/* Icon & Category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-bold text-gray-900 leading-tight">{item.category}</p>
            </div>

            {/* Count */}
            <div className="mb-2">
              <p className="text-3xl font-extrabold text-gray-900">{item.count}</p>
              <p className="text-xs text-gray-600">Mitra</p>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Zap size={12} className="fill-green-600" />
              <span className="font-semibold">Respon ±{item.avgResponse} menit</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechniciansOnline;
