import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Star, Zap, Users } from 'lucide-react';
import { getActivities } from '../api/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(128);

  useEffect(() => {
    (async () => {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();

    // Simulate live counter
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 2));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (mins) => {
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} jam lalu`;
  };

  // Extract area only (remove "Depok" prefix)
  const getAreaOnly = (area) => {
    return area.replace('Depok ', '').split(' ')[0];
  };

  if (loading) return null;

  return (
    <section className="mb-6 lg:mb-8" data-testid="activity-feed-section">
      {/* Header */}
      <div className="mb-3 lg:mb-4">
        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="text-green-600" size={24} />
          Aktif di Area Anda
        </h2>
        <p className="text-xs lg:text-sm text-gray-500 mt-1">Update layanan dan ketersediaan mitra di sekitar Depok</p>
      </div>

      {/* Compact Stats Row - 1 horizontal card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl lg:rounded-2xl p-4 lg:p-5 mb-4 text-white shadow-md">
        <div className="grid grid-cols-4 gap-2 lg:gap-4">
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-extrabold" data-testid="live-count">{liveCount}</p>
            <p className="text-[10px] lg:text-xs text-green-50 mt-0.5">Pesanan hari ini</p>
          </div>
          <div className="text-center border-l border-white/20">
            <p className="text-2xl lg:text-3xl font-extrabold">42</p>
            <p className="text-[10px] lg:text-xs text-green-50 mt-0.5">Mitra aktif</p>
          </div>
          <div className="text-center border-l border-white/20">
            <p className="text-2xl lg:text-3xl font-extrabold">98%</p>
            <p className="text-[10px] lg:text-xs text-green-50 mt-0.5">Rating baik</p>
          </div>
          <div className="text-center border-l border-white/20">
            <p className="text-2xl lg:text-3xl font-extrabold">±5</p>
            <p className="text-[10px] lg:text-xs text-green-50 mt-0.5">Menit respon</p>
          </div>
        </div>
      </div>

      {/* Desktop: 2 columns layout */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-4">
        {/* Left: Update Terbaru */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Update Terbaru
          </h3>
          <div className="space-y-2">
            {activities.slice(0, 3).map((act) => {
              const area = getAreaOnly(act.area);
              return (
                <div
                  key={act.id}
                  className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition"
                >
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {act.service_name} selesai di {area}
                  </p>
                  <p className="text-xs text-gray-500">{formatTime(act.minutes_ago)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Stats */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">Ringkasan Hari Ini</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={18} className="text-green-600" />
                <p className="text-xs text-gray-600">Mitra Online</p>
              </div>
              <p className="text-3xl font-extrabold text-green-700">57</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-blue-600" />
                <p className="text-xs text-gray-600">Respon Tercepat</p>
              </div>
              <p className="text-3xl font-extrabold text-blue-700">5m</p>
            </div>
          </div>
          <div className="mt-3 bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-purple-600 fill-purple-600" />
              <p className="text-xs text-gray-600">Rating Tertinggi</p>
            </div>
            <p className="text-3xl font-extrabold text-purple-700">4.9</p>
          </div>
        </div>
      </div>

      {/* Mobile: Update Terbaru only (max 2 items) */}
      <div className="lg:hidden space-y-2">
        <h3 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Update Terbaru
        </h3>
        {activities.slice(0, 2).map((act) => {
          const area = getAreaOnly(act.area);
          return (
            <div
              key={act.id}
              className="bg-white border border-gray-200 rounded-xl p-3"
            >
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {act.service_name} selesai di {area}
              </p>
              <p className="text-xs text-gray-500">{formatTime(act.minutes_ago)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActivityFeed;
