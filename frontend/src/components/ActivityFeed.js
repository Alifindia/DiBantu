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

  // Anonymize customer name - only show title + area
  const anonymizeName = (name, area) => {
    const titles = ['Pak', 'Bu', 'Mbak', 'Mas'];
    const firstWord = name.split(' ')[0];
    const title = ['Ibu', 'Bu'].some(t => firstWord.includes(t)) ? 'Bu' 
                  : ['Pak', 'Bapak'].some(t => firstWord.includes(t)) ? 'Pak'
                  : ['Mbak'].some(t => firstWord.includes(t)) ? 'Mbak'
                  : 'Pak';
    // Extract area without "Depok"
    const shortArea = area.replace('Depok ', '').split(' ')[0];
    return `${title} ${shortArea}`;
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

      {/* Activity list - Privacy friendly format */}
      <div className="space-y-2 lg:space-y-3">
        {activities.slice(0, 6).map((act) => {
          const anonymousName = anonymizeName(act.customer_name, act.area);
          const shortArea = act.area.split(' ')[0]; // Just "Margonda", "Beji", etc
          return (
            <div
              key={act.id}
              className="bg-white rounded-xl shadow-sm p-3 lg:p-4 border border-gray-100 hover:shadow-md transition"
              data-testid={`activity-${act.id}`}
            >
              <div className="flex items-center gap-3">
                {/* Green status indicator */}
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base font-semibold text-gray-900">
                    🟢 {anonymousName} baru menyelesaikan service {act.service_name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs lg:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-green-600" />
                      {shortArea}
                    </span>
                    <span>•</span>
                    <span>{formatTime(act.minutes_ago)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom stats - more social proof */}
      <div className="mt-4 lg:mt-6 grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 lg:p-4">
          <p className="text-2xl lg:text-3xl font-bold text-green-700">42</p>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">teknisi aktif di area Anda</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 lg:p-4">
          <p className="text-2xl lg:text-3xl font-bold text-blue-700">{activities.length}</p>
          <p className="text-xs lg:text-sm text-gray-600 mt-1">layanan selesai hari ini</p>
        </div>
      </div>
    </section>
  );
};

export default ActivityFeed;
