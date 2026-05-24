import React from 'react';
import { Zap } from 'lucide-react';

const TechniciansOnline = () => {
  // Online partners by category
  const onlineByCategory = [
    { category: 'AC', count: 8, avgResponse: 5, icon: '❄️' },
    { category: 'Listrik & CCTV', count: 12, avgResponse: 7, icon: '⚡' },
    { category: 'Plumbing', count: 6, avgResponse: 10, icon: '💧' },
    { category: 'Cleaning & Pest', count: 15, avgResponse: 8, icon: '✨' },
    { category: 'Renovasi', count: 9, avgResponse: 12, icon: '🔨' },
    { category: 'Pindahan & Angkut', count: 7, avgResponse: 15, icon: '🚚' },
  ];

  return (
    <section className="mb-6 lg:mb-8" data-testid="technicians-online-section">
      {/* Header */}
      <div className="mb-3 lg:mb-4">
        <h2 className="text-base lg:text-xl font-bold text-gray-900">Mitra Aktif Sekarang</h2>
        <p className="text-xs text-gray-500 mt-0.5">Siap melayani kebutuhan Anda dengan cepat</p>
      </div>

      {/* Horizontal carousel - compact cards */}
      <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 snap-x no-scrollbar">
        {onlineByCategory.map((item) => (
          <div
            key={item.category}
            className="bg-white border border-gray-200 rounded-xl p-3 min-w-[120px] lg:min-w-[140px] snap-start flex-shrink-0 hover:shadow-md transition"
            data-testid={`online-${item.category}`}
          >
            {/* Icon & Category - horizontal */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-lg">{item.icon}</span>
              <p className="text-xs font-bold text-gray-900 leading-tight">{item.category}</p>
            </div>

            {/* Count - smaller */}
            <p className="text-2xl font-extrabold text-gray-900 mb-0.5">{item.count}</p>
            <p className="text-[10px] text-gray-500 mb-2">Mitra</p>

            {/* Response time - compact */}
            <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-fit">
              <Zap size={10} className="fill-green-600" />
              <span className="font-semibold">±{item.avgResponse}m</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechniciansOnline;
