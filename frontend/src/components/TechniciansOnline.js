import React from 'react';
import { Zap, Users, Clock } from 'lucide-react';

const TechniciansOnline = () => {
  // Mock data for online technicians by category
  const onlineByCategory = [
    { category: 'AC', count: 8, avgResponse: 5, icon: '❄️' },
    { category: 'Listrik & CCTV', count: 12, avgResponse: 7, icon: '⚡' },
    { category: 'Plumbing', count: 6, avgResponse: 10, icon: '💧' },
    { category: 'Cleaning & Pest', count: 15, avgResponse: 8, icon: '✨' },
    { category: 'Renovasi', count: 9, avgResponse: 12, icon: '🔨' },
    { category: 'Pindahan & Angkut', count: 7, avgResponse: 15, icon: '🚚' },
  ];

  return (
    <section className="mb-6 lg:mb-10" data-testid="technicians-online-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-base lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-green-600" size={24} />
            Teknisi Online Sekarang
          </h2>
          <p className="text-xs lg:text-sm text-gray-500 mt-1">Siap melayani Anda dengan cepat</p>
        </div>
      </div>

      {/* Online technicians grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {onlineByCategory.map((item) => (
          <div
            key={item.category}
            className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-xl lg:rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            data-testid={`online-${item.category}`}
          >
            {/* Icon & Category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm lg:text-base font-bold text-gray-900 leading-tight">{item.category}</p>
            </div>

            {/* Count */}
            <div className="flex items-baseline gap-1 mb-2">
              <p className="text-3xl lg:text-4xl font-extrabold text-green-700">{item.count}</p>
              <p className="text-xs lg:text-sm text-gray-600">Teknisi</p>
            </div>

            {/* Response time */}
            <div className="flex items-center gap-1.5 text-xs lg:text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <Zap size={12} className="fill-green-600" />
                <span className="font-semibold">Respon</span>
              </div>
              <span className="text-gray-600">~{item.avgResponse} menit</span>
            </div>

            {/* Online indicator */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Tersedia sekarang</span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall stats */}
      <div className="mt-4 lg:mt-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl lg:rounded-2xl p-4 lg:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm lg:text-base text-green-50 mb-1">Total Teknisi Online</p>
            <p className="text-3xl lg:text-4xl font-extrabold">57 Teknisi</p>
          </div>
          <div className="text-right">
            <p className="text-sm lg:text-base text-green-50 mb-1">Respon Tercepat</p>
            <div className="flex items-center gap-2 justify-end">
              <Clock size={20} />
              <p className="text-2xl lg:text-3xl font-extrabold">5 Menit</p>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <p className="text-xs lg:text-sm text-green-50 text-center">
            💡 <strong>Conversion Tip:</strong> Semakin banyak teknisi online, semakin cepat pesanan Anda ditangani!
          </p>
        </div>
      </div>
    </section>
  );
};

export default TechniciansOnline;
