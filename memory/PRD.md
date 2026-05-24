# TemuJasa - Product Requirements Document

## Original Problem Statement
User meminta dibuatkan menjadi aplikasi ReactJS web berdasarkan desain mobile app "TemuJasa" - sebuah marketplace layanan rumah tangga untuk Indonesia.

**Update Iteration 2:** User memberikan struktur kategori final (7 kategori dengan services & common issues spesifik) dan meminta UI 100% mirip design + versi desktop responsive.

## User Choices
- Build all features dari desain
- Use dummy/mock data realistis Indonesia
- Mock payment (tanpa payment gateway riil)
- No external API keys
- 7 service categories dengan services + common issues
- UI 100% mirip dengan desain
- Desktop responsive version

## Architecture & Tech Stack
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Frontend**: React 19 + React Router v7 + Tailwind CSS + Lucide Icons
- **Design**: Mobile-first, primary color green-700 (#047857), brand logo "Temu(black) + Jasa(green)" with tagline "Jasa rumah & digital terpercaya"
- **Hero Image**: Real photo of TemuJasa technician with toolbox (provided by user)
- **Responsive**: Mobile-first dengan `lg:` breakpoint untuk desktop layout

## Service Categories & Services (Total: 7 kategori, 30 services)

### A. AC & Air Conditioning (4 services)
- Cuci & Maintenance AC, Isi Freon AC, Perbaikan AC, Bongkar Pasang AC
- Common Issues: AC tidak dingin, AC bocor, AC berisik, AC mati

### B. Plumbing & Water System (5 services)
- Perbaikan Saluran Mampet, Perbaikan Kebocoran, Service Toilet & Wastafel, Service Pompa Air, Instalasi Pipa & Air
- Common Issues: Saluran mampet, Pipa bocor, Toilet mampet, Air kecil, Pompa mati

### C. Home Cleaning (5 services)
- General Cleaning, Deep Cleaning, Cleaning Kamar Mandi, Cleaning Sofa & Kasur, Cleaning Kantor & Kos
- Common Issues: Rumah kotor, Noda membandel, Bau tidak sedap, Debu menumpuk

### D. Electrical Services / Listrik (4 services)
- Perbaikan Kelistrikan, Instalasi Listrik, Perbaikan Lampu & Saklar, Perbaikan Stop Kontak
- Common Issues: MCB turun, Konslet, Lampu mati, Stop kontak rusak

### E. Pet Home Care (4 services)
- Grooming Hewan, Pet Visit, Pet Walking, Cleaning Pet Area
- Common Issues: Bulu rontok, Hewan bau, Kandang kotor, Owner keluar kota

### F. Pest Control (4 services)
- Anti Rayap, Anti Serangga & Kecoa, Anti Tikus, Fogging
- Common Issues: Banyak kecoa, Tikus di rumah, Rayap kayu, Nyamuk berlebih

### G. Smart Home & CCTV (4 services)
- Instalasi CCTV, Setup WiFi, Instalasi Smart Lock, Instalasi Smart Lamp
- Common Issues: CCTV offline, WiFi tidak stabil, Smart device error

## What's Been Implemented

### Backend API (`/app/backend/server.py`)
- ✅ GET /api/categories - 7 categories with common_issues
- ✅ GET /api/services - 30 services (with category filter)
- ✅ GET /api/services/category/{category}
- ✅ GET /api/technicians - 14 technicians (with sort: rating/distance/price)
- ✅ GET /api/technicians/{id}
- ✅ POST /api/orders
- ✅ GET /api/orders, GET /api/orders/{id}, PUT /api/orders/{id}/status
- ✅ POST /api/reviews (auto-updates technician rating)
- ✅ GET /api/technicians/{id}/reviews

### Frontend Pages (Mobile + Desktop Responsive)
- ✅ **HomePage** - Brand logo TemuJasa, tagline, hero dengan foto teknisi real, search bar, 7 categories, trust banners, **ActivityFeed (social proof)**, nearby technicians
- ✅ **ActivityFeed component** - Live activity feed Depok (127 pesanan hari ini, 42 teknisi online, 98% rating), 12 mock activities dengan status badges, area, technician info, time
- ✅ **BantuinPage** - Custom help request entry: hero "Mau dibantu apa hari ini?", 8 quick suggestions (Antri makanan, Tukang las, dll), "Cara Kerja" 4 steps
- ✅ **BantuinFormPage** - Form lengkap: judul, detail, lokasi, jadwal (4 opts), budget (6 opts + custom), photo upload, escrow notice
- ✅ **BantuinDetailPage** - 3 auto-generated helper offers, status tracking (Mencari→Helper Dipilih→Menuju Lokasi→Dikerjakan→Selesai), demo advance buttons
- ✅ **BantuinListPage** - List all bantuin requests with status badges
- ✅ **BottomNav redesigned** - 5 items dengan center floating BANTUIN button (green gradient + Sparkles icon)
- ✅ **ServicesPage** - Vertical sidebar tabs (7 categories) + Common Issues pills + Services grid
- ✅ **TechniciansPage** - List teknisi dengan filter, heart favorite button, desktop summary sidebar
- ✅ **OrderSummaryPage** - Desktop payment sidebar
- ✅ **PaymentPage** - 4 payment methods (mock)
- ✅ **MyOrdersPage** - Desktop 2-col grid
- ✅ **OrderDetailPage** - Map mockup, chat button functional
- ✅ **OrderTrackingPage** - Timeline
- ✅ **RatingPage** - 5-star rating
- ✅ **ChatListPage** - List percakapan dengan teknisi + unread badge
- ✅ **ChatDetailPage** - Real-time chat dengan auto-reply teknisi mock
- ✅ **FavoritesPage** - Favorit teknisi (localStorage) dengan remove + chat
- ✅ **AccountPage** - Profile card Gold Member, TemuPoin, menu (Edit Profil, Daftar Alamat, Voucher, dll)

### Responsive Behaviors
- Mobile: Bottom navigation (5 tabs) visible, single column layouts
- Desktop (`lg:` breakpoint 1024px+): Top navigation bar, multi-column layouts, fixed sidebars, bottom nav hidden

## Testing Status

### Iteration 1
- Backend: 20/20 pytest tests PASSED
- Frontend: All E2E flows tested - 100% success

### Iteration 2 (After 7 categories update + desktop responsive)
- **Backend: 23/23 pytest tests PASSED** (100%)
- **Frontend: 100% PASS** mobile (390x844) + desktop (1440x900)
- Found & Fixed 1 critical bug: ServiceCategory enum was out of sync (testing agent auto-fixed)

## Mocked Items
- **Payment Gateway**: MOCKED - tidak ada integrasi payment processor riil
- **Map View**: Static mockup di OrderDetailPage
- **Real-time tracking**: Demo button untuk simulate order completion

## Prioritized Backlog

### P0 (Critical)
- All complete ✅

### P1 (Important - Future)
- Authentication system (user login/register)
- Real payment gateway integration (Midtrans/Stripe)
- Real-time chat (user ↔ teknisi)
- Favorites system
- User profile management

### P2 (Nice to Have)
- Real map integration (Google Maps/Mapbox)
- Push notifications
- Multi-address management
- Voucher/promo code system
- Referral program
- Teknisi side app/dashboard

## Files Structure
```
/app/backend/
  ├── server.py (FastAPI + 7 enum categories)
  ├── seed_data.py (7 cats, 30 services, 14 technicians)
  ├── tests/test_temujasa_api.py (23 tests)
  └── requirements.txt

/app/frontend/src/
  ├── App.js (Routing)
  ├── api/api.js (getCategories + all API functions)
  ├── components/ (Header, BottomNav lg:hidden, ServiceCard, TechnicianCard)
  └── pages/
      ├── HomePage.js (Desktop topnav + 7 categories)
      ├── ServicesPage.js (Sidebar tabs + common issues)
      ├── TechniciansPage.js (Desktop summary sidebar)
      ├── OrderSummaryPage.js (Responsive)
      ├── PaymentPage.js (Responsive)
      ├── MyOrdersPage.js (Desktop 2-col grid)
      ├── OrderDetailPage.js (Desktop info sidebar)
      ├── OrderTrackingPage.js (Desktop responsive)
      ├── RatingPage.js (Centered desktop)
      └── ComingSoonPage.js
```
