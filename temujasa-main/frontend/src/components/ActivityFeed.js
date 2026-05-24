import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle2, Activity as ActivityIcon, Users } from 'lucide-react';
import { getActivities } from '../api/api';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(127);

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
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (mins) => {
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    return `${hrs} jam lalu`;
  };

  const getStatusBadge = (status) => {
    if (status === 'in_progress') return { label: 'Sedang Berlangsung', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' };
    if (status === 'completed') return { label: 'Selesai', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
    return { label: 'Baru Dipesan', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
  };

  if (loading) return null;

  return (
    <section className="mb-6 lg:mb-10" data-testid="activity-feed-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 lg:mb-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <h2 className="text-base lg:text-2xl font-bold text-gray-900">Aktivitas Terkini</h2>
          <span className="bg-green-100 text-green-700 text-[10px] lg:text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <MapPin size={10} />
            Depok
          </span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 rounded-xl lg:rounded-2xl p-3 lg:p-5 mb-3 lg:mb-4 text-white shadow-md">
        <div className="grid grid-cols-3 gap-2 lg:gap-4">
          <div className="text-center border-r border-white/20 pr-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <ActivityIcon size={14} className="lg:w-4 lg:h-4" />
              <p className="text-[10px] lg:text-xs text-green-50">Hari Ini</p>
            </div>
            <p className="text-lg lg:text-2xl font-bold" data-testid="live-count">{liveCount}</p>
            <p className="text-[10px] lg:text-xs text-green-100">Pesanan</p>
          </div>
          <div className="text-center border-r border-white/20 pr-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={14} className="lg:w-4 lg:h-4" />
              <p className="text-[10px] lg:text-xs text-green-50">Teknisi Aktif</p>
            </div>
            <p className="text-lg lg:text-2xl font-bold">42</p>
            <p className="text-[10px] lg:text-xs text-green-100">Online</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 size={14} className="lg:w-4 lg:h-4" />
              <p className="text-[10px] lg:text-xs text-green-50">Selesai</p>
            </div>
            <p className="text-lg lg:text-2xl font-bold">98%</p>
            <p className="text-[10px] lg:text-xs text-green-100">Rating Baik</p>
          </div>
        </div>
      </div>

      {/* Activity list - scrollable horizontal on mobile, grid 2-col on desktop */}
      <div className="lg:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x">
        {activities.slice(0, 8).map((act) => {
          const badge = getStatusBadge(act.status);
          return (
            <div
              key={act.id}
              className="bg-white rounded-xl shadow-sm p-3 min-w-[280px] snap-start border border-gray-100"
              data-testid={`activity-${act.id}`}
            >
              <div className="flex items-start gap-2 mb-2">
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`}></span>
                  {badge.label}
                </div>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
                  <Clock size={10} />
                  {formatTime(act.minutes_ago)}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <img src={act.customer_avatar} alt={act.customer_name} className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    <span className="text-green-700">{act.customer_name}</span> memesan
                  </p>
                  <p className="text-[11px] text-gray-600 truncate">{act.service_name}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-2 flex items-center gap-2">
                <img src={act.technician_photo} alt={act.technician_name} className="w-6 h-6 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-500">Teknisi</p>
                  <p className="text-[11px] font-semibold text-gray-900 truncate">{act.technician_name}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 flex-shrink-0">
                  <MapPin size={10} />
                  <span className="truncate max-w-[60px]">{act.area.replace('Depok ', '')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 gap-4">
        {activities.slice(0, 9).map((act) => {
          const badge = getStatusBadge(act.status);
          return (
            <div
              key={act.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md p-5 border border-gray-100 transition card-hover"
              data-testid={`activity-desktop-${act.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                  <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`}></span>
                  {badge.label}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  {formatTime(act.minutes_ago)}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img src={act.customer_avatar} alt={act.customer_name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    <span className="text-green-700">{act.customer_name}</span> memesan
                  </p>
                  <p className="text-sm text-gray-600 truncate">{act.service_name}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
                <img src={act.technician_photo} alt={act.technician_name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Teknisi</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{act.technician_name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 bg-gray-50 px-2 py-1 rounded-full">
                  <MapPin size={11} />
                  <span>{act.area}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActivityFeed;
