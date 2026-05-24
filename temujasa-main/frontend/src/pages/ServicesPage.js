import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, AlertCircle, Snowflake, Zap, Droplets, Sparkles, Dog, Bug, Camera } from 'lucide-react';
import { getServices, getCategories } from '../api/api';

const ServicesPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(category);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadServices();
  }, [activeCategory]);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices(activeCategory);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    snowflake: Snowflake,
    zap: Zap,
    droplets: Droplets,
    sparkles: Sparkles,
    dog: Dog,
    bug: Bug,
    camera: Camera,
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const activeCategoryData = categories.find(c => c.id === activeCategory);
  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-1 hover:bg-gray-100 rounded-full transition" data-testid="back-button">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">Pilih Layanan</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4 lg:mb-6">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-700"
              data-testid="search-services-input"
            />
          </div>
        </div>

        {/* Layout: Sidebar (categories) + Content (services) */}
        <div className="flex gap-4 lg:gap-6">
          {/* Categories Sidebar - Vertical Tabs */}
          <aside className="w-24 sm:w-32 lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Sparkles;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-3 lg:px-4 py-3 lg:py-4 flex items-center gap-2 lg:gap-3 transition border-l-4 ${
                      isActive
                        ? 'border-green-700 bg-green-50 text-green-700 font-semibold'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                    data-testid={`sidebar-category-${cat.id}`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span className="text-xs lg:text-sm">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Services Content */}
          <main className="flex-1 min-w-0">
            {/* Category Header (Desktop) */}
            {activeCategoryData && (
              <div className="hidden lg:block mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{activeCategoryData.full_name}</h2>
                <p className="text-gray-500 text-sm">{services.length} layanan tersedia</p>
              </div>
            )}

            {/* Common Issues */}
            {activeCategoryData?.common_issues?.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 lg:p-4 mb-4 lg:mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs lg:text-sm font-semibold text-amber-900">Masalah Umum</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeCategoryData.common_issues.map((issue, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-amber-800 px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-medium border border-amber-200"
                      data-testid={`common-issue-${idx}`}
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5" data-testid="services-list">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => navigate(`/technicians/${service.id}`, { state: { service } })}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md p-4 cursor-pointer transition card-hover"
                    data-testid={`service-card-${service.id}`}
                  >
                    <div className="flex gap-3 lg:gap-4">
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">{service.name}</h3>
                        <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                        <div>
                          <p className="text-[10px] lg:text-xs text-gray-500">Mulai dari</p>
                          <p className="font-bold text-green-700 text-sm lg:text-base">{formatPrice(service.base_price)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredServices.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    Tidak ada layanan tersedia
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3 lg:p-4">
              <p className="text-xs lg:text-sm text-gray-700 flex items-start gap-2">
                <span>💡</span>
                <span><strong>Catatan:</strong> Harga dapat berubah sesuai kondisi di lokasi.</span>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
