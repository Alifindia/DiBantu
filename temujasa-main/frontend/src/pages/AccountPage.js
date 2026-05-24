import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, MapPin, CreditCard, Bell, Shield, HelpCircle,
  FileText, Gift, Globe, Star, ChevronRight, LogOut
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import DesktopNav from '../components/DesktopNav';

const AccountPage = () => {
  const navigate = useNavigate();

  const profile = {
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '+62 812-3456-7890',
    avatar: 'https://i.pravatar.cc/150?img=8',
    points: 1250,
    member: 'Gold Member'
  };

  const menuSections = [
    {
      title: 'Akun Saya',
      items: [
        { icon: User, label: 'Edit Profil', testId: 'menu-edit-profile' },
        { icon: MapPin, label: 'Daftar Alamat', testId: 'menu-addresses' },
        { icon: CreditCard, label: 'Metode Pembayaran', testId: 'menu-payment-methods' },
      ]
    },
    {
      title: 'Aktivitas',
      items: [
        { icon: Star, label: 'Riwayat Penilaian', testId: 'menu-ratings' },
        { icon: Gift, label: 'Voucher & Promo', badge: '3 Baru', testId: 'menu-vouchers' },
        { icon: FileText, label: 'Riwayat Pesanan', action: () => navigate('/my-orders'), testId: 'menu-order-history' },
      ]
    },
    {
      title: 'Preferensi',
      items: [
        { icon: Bell, label: 'Notifikasi', testId: 'menu-notifications' },
        { icon: Globe, label: 'Bahasa', value: 'Indonesia', testId: 'menu-language' },
        { icon: Shield, label: 'Privasi & Keamanan', testId: 'menu-privacy' },
      ]
    },
    {
      title: 'Bantuan',
      items: [
        { icon: HelpCircle, label: 'Pusat Bantuan', testId: 'menu-help' },
        { icon: FileText, label: 'Syarat & Ketentuan', testId: 'menu-terms' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-12">
      <DesktopNav />
      <header className="lg:hidden bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="lg:hidden p-1 hover:bg-gray-100 rounded-full" data-testid="back-button">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="font-bold text-lg lg:text-2xl text-gray-900">Akun</h1>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-green-700 font-medium text-sm">Kembali ke Beranda</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-4 lg:py-8 space-y-4 lg:space-y-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-green-700 to-emerald-700 rounded-2xl shadow-lg p-5 lg:p-6 text-white">
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-full ring-4 ring-white/30 object-cover"
              data-testid="profile-avatar"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg lg:text-xl font-bold truncate" data-testid="profile-name">{profile.name}</h2>
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {profile.member}
                </span>
              </div>
              <p className="text-sm text-green-50 truncate">{profile.email}</p>
              <p className="text-sm text-green-50">{profile.phone}</p>
            </div>
          </div>

          {/* Points & Stats */}
          <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl lg:text-2xl font-bold" data-testid="profile-points">{profile.points}</p>
              <p className="text-xs text-green-100">TemuPoin</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-xl lg:text-2xl font-bold">12</p>
              <p className="text-xs text-green-100">Pesanan</p>
            </div>
            <div className="text-center">
              <p className="text-xl lg:text-2xl font-bold">3</p>
              <p className="text-xs text-green-100">Favorit</p>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 lg:px-5 py-3 border-b border-gray-100">
              <p className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {section.title}
              </p>
            </div>
            <div>
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={iIdx}
                    onClick={item.action || (() => alert(`${item.label} - Coming Soon!`))}
                    className="w-full flex items-center gap-3 px-4 lg:px-5 py-3 lg:py-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-b-0"
                    data-testid={item.testId}
                  >
                    <div className="w-9 h-9 lg:w-10 lg:h-10 bg-green-50 text-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm lg:text-base font-medium text-gray-900">{item.label}</p>
                      {item.value && <p className="text-xs text-gray-500">{item.value}</p>}
                    </div>
                    {item.badge && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={() => alert('Logout - Demo')}
          className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl py-3 lg:py-4 font-semibold flex items-center justify-center gap-2 transition shadow-sm"
          data-testid="logout-button"
        >
          <LogOut size={18} />
          Keluar
        </button>

        <p className="text-center text-xs text-gray-400 pt-2">
          TemuJasa v1.0.0 • Jakarta, Indonesia
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default AccountPage;
