import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Snowflake, Zap, Droplets, Sparkles, Dog, Bug, Camera, ShieldCheck, Lock, Tag, Bell, MapPin, Hammer, Truck, PawPrint } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';
import FloatingBantuinButton from '../components/FloatingBantuinButton';
import ActivityFeed from '../components/ActivityFeed';
import ReviewFeed from '../components/ReviewFeed';
import TechniciansOnline from '../components/TechniciansOnline';
import { getCategories, getTechnicians } from '../api/api';

const TECHNICIAN_IMG = 'https://customer-assets.emergentagent.com/job_react-web-builder-5/artifacts/k4uicyvh_127940-removebg-preview.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [nearbyTechnicians, setNearbyTechnicians] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cats, techs] = await Promise.all([
          getCategories(),
          getTechnicians(null, 'distance')
        ]);
        setCategories(cats);
        setNearbyTechnicians(techs.slice(0, 6));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    })();
  }, []);

  const iconMap = { 
    snowflake: Snowflake, 
    zap: Zap, 
    droplets: Droplets, 
    sparkles: Sparkles, 
    'paw-print': PawPrint,
    dog: Dog, 
    bug: Bug, 
    camera: Camera,
    hammer: Hammer,
    truck: Truck,
    sparkle: Sparkles
  };
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    brown: 'bg-amber-100 text-amber-700',
  };

  // Brand logo component
  const BrandLogo = ({ size = 'normal' }) => (
    <div className="flex flex-col">
      <h1 className={`font-extrabold leading-none ${size === 'large' ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'}`}>
        <span className="text-gray-900">Temu</span>
        <span className="text-green-700">Jasa</span>
      </h1>
      <p className={`text-gray-500 mt-1 ${size === 'large' ? 'text-sm lg:text-base' : 'text-xs lg:text-sm'}`}>
        Jasa rumah & digital terpercaya
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <DesktopNav />

      {/* Mobile Header - matches design */}
      <header className="lg:hidden bg-white sticky top-0 z-50">
        <div className="px-4 pt-4 pb-2 flex items-start justify-between">
          <BrandLogo />
          <button className="relative p-2" data-testid="notification-button-mobile">
            <Bell size={26} className="text-gray-800" strokeWidth={2.2} />
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">3</span>
          </button>
        </div>
      </header>

      {/* Hero Section - matches new design with real technician photo */}
      <section className="px-4 pt-3 lg:pt-8 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 rounded-3xl overflow-hidden shadow-xl relative">
            <div className="px-6 pt-6 pb-32 lg:px-12 lg:pt-12 lg:pb-32 flex items-start gap-4 lg:gap-8 relative">
              <div className="flex-1 text-white relative z-10 max-w-[60%] lg:max-w-[55%]">
                <h2 className="text-2xl lg:text-5xl font-extrabold leading-tight mb-3 lg:mb-4" data-testid="hero-title">
                  Butuh bantuan<br />apa hari ini?
                </h2>
                <p className="text-green-50 text-sm lg:text-xl leading-snug">
                  Temukan jasa terpercaya,<br />cepat & bergaransi.
                </p>
              </div>

              {/* Technician Image - real photo */}
              <div className="absolute right-0 bottom-0 lg:right-4 w-44 h-56 lg:w-96 lg:h-[28rem] flex items-end justify-end">
                <img
                  src={TECHNICIAN_IMG}
                  alt="Teknisi TemuJasa"
                  className="h-full w-auto object-contain object-bottom drop-shadow-2xl"
                  data-testid="hero-technician-image"
                />
              </div>
            </div>

            {/* Search Bar (overlapping hero bottom) */}
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8">
              <div className="bg-white rounded-full shadow-2xl px-5 py-3 lg:px-6 lg:py-4 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Cari jasa, misal: cuci AC, listrik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700 text-sm lg:text-base placeholder:text-gray-400"
                  data-testid="search-input"
                />
                <button className="w-9 h-9 lg:w-11 lg:h-11 bg-green-700 hover:bg-green-800 rounded-full flex items-center justify-center text-white transition flex-shrink-0">
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-4 lg:mt-8">

        {/* Categories Section */}
        <section id="categories-section" className="mb-6 lg:mb-10">
          <div className="flex justify-between items-end mb-4 lg:mb-6">
            <div>
              <h2 className="text-base lg:text-2xl font-bold text-gray-900">Pilih Kategori Layanan</h2>
              <p className="hidden lg:block text-gray-500 text-sm mt-1">{categories.length} kategori tersedia</p>
            </div>
          </div>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-4">
            {categories.map((category) => {
              const Icon = iconMap[category.icon] || Sparkles;
              const colorClass = colorMap[category.color] || 'bg-gray-100 text-gray-600';
              return (
                <button
                  key={category.id}
                  onClick={() => navigate(`/services/${category.id}`)}
                  className="flex flex-col items-center gap-2 group"
                  data-testid={`category-${category.id}`}
                >
                  <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl ${colorClass} flex items-center justify-center group-hover:scale-110 transition shadow-sm group-hover:shadow-lg`}>
                    <Icon size={26} className="lg:w-9 lg:h-9" />
                  </div>
                  <span className="text-xs lg:text-sm font-medium text-gray-700 text-center leading-tight">{category.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Trust Banners */}
        <section className="grid grid-cols-3 gap-2 lg:gap-4 mb-6 lg:mb-10">
          {[
            { icon: ShieldCheck, color: 'green', title: 'Teknisi Terverifikasi', sub: '& Berpengalaman' },
            { icon: Lock, color: 'blue', title: 'Pembayaran Aman', sub: '100% Terlindungi' },
            { icon: Tag, color: 'yellow', title: 'Harga Transparan', sub: 'Tanpa Biaya Tersembunyi' },
          ].map((banner, i) => {
            const Icon = banner.icon;
            return (
              <div key={i} className="bg-white border border-gray-100 rounded-xl lg:rounded-2xl p-3 lg:p-5 shadow-sm">
                <div className="flex items-start gap-2 lg:gap-3">
                  <div className={`w-8 h-8 lg:w-12 lg:h-12 bg-${banner.color}-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={`lg:w-6 lg:h-6 text-${banner.color}-700`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm font-bold text-gray-900 leading-tight">{banner.title}</p>
                    <p className="text-[10px] lg:text-xs text-gray-500 mt-0.5 leading-tight">{banner.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Activity Feed - Privacy-friendly */}
        <ActivityFeed />

        {/* Technicians Online - For Conversion */}
        <TechniciansOnline />

        {/* Review Feed - Real-time Social Proof */}
        <ReviewFeed />

        {/* Nearby Technicians */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4 lg:mb-6">
            <h2 className="text-base lg:text-2xl font-bold text-gray-900">Teknisi Terdekat</h2>
            <button onClick={() => navigate('/technicians/all')} className="text-sm lg:text-base text-green-700 font-semibold hover:underline" data-testid="see-all-technicians">
              Lihat semua
            </button>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="lg:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {nearbyTechnicians.slice(0, 3).map((tech) => (
              <div
                key={tech.id}
                onClick={() => navigate(`/technicians/all`)}
                className="bg-white rounded-xl shadow-sm p-3 flex flex-col items-center text-center min-w-[110px] snap-start cursor-pointer"
                data-testid={`nearby-tech-${tech.id}`}
              >
                <img src={tech.photo_url} alt={tech.name} className="w-14 h-14 rounded-full mb-2 object-cover" />
                <p className="text-xs font-bold text-gray-900">{tech.name}</p>
                <div className="flex items-center gap-1 text-yellow-500 text-[10px] mt-1">
                  <span>⭐</span>
                  <span className="text-gray-700 font-medium">{tech.rating}</span>
                  <span className="text-gray-500">({tech.reviews_count})</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                  <MapPin size={10} />
                  <span>{tech.distance} km</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden lg:grid grid-cols-3 gap-6">
            {nearbyTechnicians.map((tech) => (
              <div
                key={tech.id}
                onClick={() => navigate(`/technicians/all`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 cursor-pointer transition card-hover"
                data-testid={`nearby-tech-desktop-${tech.id}`}
              >
                <div className="flex items-center gap-4">
                  <img src={tech.photo_url} alt={tech.name} className="w-20 h-20 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{tech.name}</h3>
                      <span className="text-green-700 text-xs">✓</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tech.specialization}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <span>⭐</span>
                        <span className="text-gray-900 font-medium">{tech.rating}</span>
                        <span className="text-gray-500 text-xs">({tech.reviews_count})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin size={12} />
                        <span>{tech.distance} km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <FloatingBantuinButton />
      <BottomNav />
    </div>
  );
};

export default HomePage;
