"""
Seed data script for TemuJasa application - 8 Categories Final
Populates MongoDB with realistic Indonesian service marketplace data
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]


# 8 Categories with their common issues
CATEGORIES_DATA = [
    {
        "id": "AC",
        "name": "AC",
        "full_name": "AC & Air Conditioning",
        "icon": "snowflake",
        "color": "blue",
        "common_issues": ["AC tidak dingin", "AC bocor", "AC berisik", "AC mati"]
    },
    {
        "id": "Plumbing",
        "name": "Plumbing",
        "full_name": "Plumbing & Water System",
        "icon": "droplets",
        "color": "cyan",
        "common_issues": ["Saluran mampet", "Pipa bocor", "Toilet mampet", "Air kecil", "Pompa mati"]
    },
    {
        "id": "Cleaning & Pest",
        "name": "Cleaning & Pest",
        "full_name": "Cleaning & Pest Control",
        "icon": "sparkles",
        "color": "purple",
        "common_issues": ["Rumah kotor", "Noda membandel", "Bau tidak sedap", "Debu menumpuk", "Banyak kecoa", "Tikus di rumah", "Rayap kayu", "Nyamuk berlebih"]
    },
    {
        "id": "Listrik & CCTV",
        "name": "Listrik & CCTV",
        "full_name": "Electrical & Smart Home",
        "icon": "zap",
        "color": "yellow",
        "common_issues": ["MCB turun", "Konslet", "Lampu mati", "Stop kontak rusak", "Kabel bermasalah", "CCTV offline", "WiFi tidak stabil", "Smart device error", "Internet lemot"]
    },
    {
        "id": "Renovasi",
        "name": "Renovasi",
        "full_name": "Renovasi & Konstruksi",
        "icon": "hammer",
        "color": "orange",
        "common_issues": ["Pagar rusak", "Kanopi rusak", "Atap bocor", "Tembok retak", "Plafon bocor", "Keramik pecah", "Cat mengelupas", "Ada puing bangunan berat", "Bekas bongkaran renovasi"]
    },
    {
        "id": "Pindahan & Angkut",
        "name": "Pindahan & Angkut",
        "full_name": "Moving & Transport",
        "icon": "truck",
        "color": "teal",
        "common_issues": ["Mau pindahan kos", "Mau pindahan rumah", "Butuh angkut kasur / lemari", "Barang terlalu besar", "Butuh pickup mendadak", "Ada puing sisa renovasi ringan", "Mau buang bekas bongkaran kecil", "Sisa material renovasi menumpuk"]
    },
    {
        "id": "Beauty & Event",
        "name": "Beauty & Event",
        "full_name": "Beauty & Event Decoration",
        "icon": "sparkle",
        "color": "pink",
        "common_issues": ["Butuh MUA datang ke rumah", "Makeup acara mendadak", "Butuh hairdo sekalian", "Cari MUA sesuai budget", "Butuh dekorasi acara di rumah", "Butuh backdrop simple", "Dekorasi dadakan", "Dekorasi booth jualan", "Setup ulang tahun anak", "Dekorasi lamaran sederhana"]
    },
    {
        "id": "Pet Care",
        "name": "Pet Care",
        "full_name": "Pet Home Care Services",
        "icon": "paw-print",
        "color": "brown",
        "common_issues": ["Bulu rontok", "Hewan bau", "Kandang kotor", "Owner keluar kota", "Butuh grooming di rumah"]
    }
]


# Services for each category
SERVICES_DATA = [
    # 1. AC (4 services)
    {"id": "ac-001", "name": "Cuci & Maintenance AC", "category": "AC", "description": "Pembersihan menyeluruh AC dan perawatan berkala", "base_price": 85000, "image_url": ""},
    {"id": "ac-002", "name": "Isi Freon AC", "category": "AC", "description": "Pengisian freon untuk AC yang tidak dingin", "base_price": 250000, "image_url": ""},
    {"id": "ac-003", "name": "Perbaikan AC", "category": "AC", "description": "Perbaikan AC rusak, bocor, atau berisik", "base_price": 150000, "image_url": ""},
    {"id": "ac-004", "name": "Bongkar Pasang AC", "category": "AC", "description": "Bongkar dan pasang ulang unit AC", "base_price": 200000, "image_url": ""},

    # 2. Plumbing (5 services)
    {"id": "plumb-001", "name": "Perbaikan Saluran Mampet", "category": "Plumbing", "description": "Atasi saluran air, WC, atau got mampet", "base_price": 150000, "image_url": ""},
    {"id": "plumb-002", "name": "Perbaikan Kebocoran", "category": "Plumbing", "description": "Perbaikan pipa bocor atau keran rusak", "base_price": 120000, "image_url": ""},
    {"id": "plumb-003", "name": "Service Toilet & Wastafel", "category": "Plumbing", "description": "Perbaikan toilet, wastafel, dan kran", "base_price": 100000, "image_url": ""},
    {"id": "plumb-004", "name": "Service Pompa Air", "category": "Plumbing", "description": "Perbaikan pompa air atau tekanan air rendah", "base_price": 180000, "image_url": ""},
    {"id": "plumb-005", "name": "Instalasi Pipa & Air", "category": "Plumbing", "description": "Instalasi pipa baru atau sistem air", "base_price": 250000, "image_url": ""},

    # 3. Cleaning & Pest (10 services)
    {"id": "clean-001", "name": "General Cleaning", "category": "Cleaning & Pest", "description": "Bersih rumah standar harian atau mingguan", "base_price": 80000, "image_url": ""},
    {"id": "clean-002", "name": "Deep Cleaning", "category": "Cleaning & Pest", "description": "Pembersihan menyeluruh seluruh rumah", "base_price": 150000, "image_url": ""},
    {"id": "clean-003", "name": "Cleaning Kamar Mandi", "category": "Cleaning & Pest", "description": "Pembersihan kamar mandi lengkap", "base_price": 60000, "image_url": ""},
    {"id": "clean-004", "name": "Cleaning Sofa & Kasur", "category": "Cleaning & Pest", "description": "Cuci sofa dan kasur dengan vacuum", "base_price": 120000, "image_url": ""},
    {"id": "clean-005", "name": "Cleaning Kantor & Kos", "category": "Cleaning & Pest", "description": "Layanan cleaning untuk kantor atau kos", "base_price": 100000, "image_url": ""},
    {"id": "clean-006", "name": "Bersih Rumah Setelah Renovasi Ringan", "category": "Cleaning & Pest", "description": "Bersih-bersih setelah renovasi kecil", "base_price": 200000, "image_url": ""},
    {"id": "pest-001", "name": "Anti Rayap", "category": "Cleaning & Pest", "description": "Basmi rayap kayu di rumah", "base_price": 300000, "image_url": ""},
    {"id": "pest-002", "name": "Anti Serangga & Kecoa", "category": "Cleaning & Pest", "description": "Semprot anti serangga dan kecoa", "base_price": 150000, "image_url": ""},
    {"id": "pest-003", "name": "Anti Tikus", "category": "Cleaning & Pest", "description": "Basmi dan cegah tikus di rumah", "base_price": 180000, "image_url": ""},
    {"id": "pest-004", "name": "Fogging", "category": "Cleaning & Pest", "description": "Fogging anti nyamuk untuk area rumah", "base_price": 200000, "image_url": ""},

    # 4. Listrik & CCTV (9 services)
    {"id": "listrik-001", "name": "Perbaikan Kelistrikan", "category": "Listrik & CCTV", "description": "Perbaikan konslet, MCB turun, atau korsleting", "base_price": 150000, "image_url": ""},
    {"id": "listrik-002", "name": "Instalasi Listrik", "category": "Listrik & CCTV", "description": "Instalasi kabel listrik baru", "base_price": 200000, "image_url": ""},
    {"id": "listrik-003", "name": "Perbaikan Lampu & Saklar", "category": "Listrik & CCTV", "description": "Ganti atau perbaiki lampu dan saklar", "base_price": 80000, "image_url": ""},
    {"id": "listrik-004", "name": "Perbaikan Stop Kontak", "category": "Listrik & CCTV", "description": "Perbaikan stop kontak mati atau rusak", "base_price": 70000, "image_url": ""},
    {"id": "listrik-005", "name": "Tambah Titik Listrik", "category": "Listrik & CCTV", "description": "Tambah titik stop kontak atau lampu baru", "base_price": 120000, "image_url": ""},
    {"id": "cctv-001", "name": "Instalasi CCTV", "category": "Listrik & CCTV", "description": "Pasang CCTV lengkap untuk rumah", "base_price": 500000, "image_url": ""},
    {"id": "cctv-002", "name": "Setup WiFi", "category": "Listrik & CCTV", "description": "Instalasi dan setup WiFi router", "base_price": 100000, "image_url": ""},
    {"id": "cctv-003", "name": "Instalasi Smart Lock", "category": "Listrik & CCTV", "description": "Pasang smart lock digital untuk pintu", "base_price": 300000, "image_url": ""},
    {"id": "cctv-004", "name": "Setting Router / Repeater", "category": "Listrik & CCTV", "description": "Setting router atau repeater WiFi", "base_price": 80000, "image_url": ""},

    # 5. Renovasi (13 services)
    {"id": "reno-001", "name": "Tukang Bangunan", "category": "Renovasi", "description": "Jasa tukang bangunan untuk renovasi", "base_price": 250000, "image_url": ""},
    {"id": "reno-002", "name": "Tukang Las", "category": "Renovasi", "description": "Jasa las untuk pagar, kanopi, pintu besi", "base_price": 200000, "image_url": ""},
    {"id": "reno-003", "name": "Perbaikan Pagar", "category": "Renovasi", "description": "Perbaikan atau pembuatan pagar baru", "base_price": 300000, "image_url": ""},
    {"id": "reno-004", "name": "Perbaikan Kanopi", "category": "Renovasi", "description": "Perbaikan atau pasang kanopi baru", "base_price": 350000, "image_url": ""},
    {"id": "reno-005", "name": "Perbaikan Atap", "category": "Renovasi", "description": "Perbaikan atap bocor atau genteng rusak", "base_price": 280000, "image_url": ""},
    {"id": "reno-006", "name": "Perbaikan Plafon", "category": "Renovasi", "description": "Perbaikan plafon bocor atau rusak", "base_price": 180000, "image_url": ""},
    {"id": "reno-007", "name": "Perbaikan Tembok", "category": "Renovasi", "description": "Perbaikan tembok retak atau berlubang", "base_price": 150000, "image_url": ""},
    {"id": "reno-008", "name": "Perbaikan Keramik", "category": "Renovasi", "description": "Ganti atau perbaiki keramik pecah", "base_price": 120000, "image_url": ""},
    {"id": "reno-009", "name": "Cat Rumah", "category": "Renovasi", "description": "Pengecatan ulang rumah atau ruangan", "base_price": 200000, "image_url": ""},
    {"id": "reno-010", "name": "Renovasi Kecil", "category": "Renovasi", "description": "Renovasi kecil ruangan atau rumah", "base_price": 500000, "image_url": ""},
    {"id": "reno-011", "name": "Bongkar Ringan", "category": "Renovasi", "description": "Bongkar tembok atau struktur ringan", "base_price": 180000, "image_url": ""},
    {"id": "reno-012", "name": "Bersih Sisa Renovasi", "category": "Renovasi", "description": "Bersihkan sisa material renovasi", "base_price": 150000, "image_url": ""},
    {"id": "reno-013", "name": "Angkut Puing Bangunan Berat", "category": "Renovasi", "description": "Angkut puing hasil renovasi besar", "base_price": 300000, "image_url": ""},

    # 6. Pindahan & Angkut (9 services)
    {"id": "move-001", "name": "Pindahan Rumah", "category": "Pindahan & Angkut", "description": "Jasa pindahan rumah lengkap", "base_price": 500000, "image_url": ""},
    {"id": "move-002", "name": "Pindahan Kos", "category": "Pindahan & Angkut", "description": "Jasa pindahan kos atau kontrakan", "base_price": 200000, "image_url": ""},
    {"id": "move-003", "name": "Angkut Barang Besar", "category": "Pindahan & Angkut", "description": "Angkut kasur, lemari, kulkas, dll", "base_price": 150000, "image_url": ""},
    {"id": "move-004", "name": "Angkut Material Ringan", "category": "Pindahan & Angkut", "description": "Angkut material bangunan ringan", "base_price": 120000, "image_url": ""},
    {"id": "move-005", "name": "Bongkar Muat Barang", "category": "Pindahan & Angkut", "description": "Jasa bongkar muat barang", "base_price": 100000, "image_url": ""},
    {"id": "move-006", "name": "Sewa Pickup / Mobil Angkut", "category": "Pindahan & Angkut", "description": "Sewa mobil pickup untuk angkut barang", "base_price": 250000, "image_url": ""},
    {"id": "move-007", "name": "Buang Puing Ringan", "category": "Pindahan & Angkut", "description": "Buang puing renovasi ringan", "base_price": 150000, "image_url": ""},
    {"id": "move-008", "name": "Angkut Puing Renovasi Ringan", "category": "Pindahan & Angkut", "description": "Angkut sisa material renovasi kecil", "base_price": 180000, "image_url": ""},
    {"id": "move-009", "name": "Bersih Sisa Bongkaran Ringan", "category": "Pindahan & Angkut", "description": "Bersihkan sisa bongkaran material", "base_price": 120000, "image_url": ""},

    # 7. Beauty & Event (20 services)
    {"id": "beauty-001", "name": "Makeup Wisuda", "category": "Beauty & Event", "description": "Makeup untuk acara wisuda", "base_price": 250000, "image_url": ""},
    {"id": "beauty-002", "name": "Makeup Lamaran", "category": "Beauty & Event", "description": "Makeup untuk acara lamaran", "base_price": 350000, "image_url": ""},
    {"id": "beauty-003", "name": "Makeup Kondangan", "category": "Beauty & Event", "description": "Makeup untuk kondangan atau pesta", "base_price": 200000, "image_url": ""},
    {"id": "beauty-004", "name": "Makeup Photoshoot", "category": "Beauty & Event", "description": "Makeup untuk photoshoot profesional", "base_price": 300000, "image_url": ""},
    {"id": "beauty-005", "name": "Makeup Bridesmaid", "category": "Beauty & Event", "description": "Makeup untuk bridesmaid pernikahan", "base_price": 280000, "image_url": ""},
    {"id": "beauty-006", "name": "Makeup Wedding", "category": "Beauty & Event", "description": "Makeup pengantin lengkap", "base_price": 800000, "image_url": ""},
    {"id": "beauty-007", "name": "Hairdo / Hijabdo", "category": "Beauty & Event", "description": "Hairdo atau hijab styling", "base_price": 150000, "image_url": ""},
    {"id": "beauty-008", "name": "Nail Art Home Service", "category": "Beauty & Event", "description": "Nail art dan manicure di rumah", "base_price": 120000, "image_url": ""},
    {"id": "beauty-009", "name": "Eyelash / Brow Service", "category": "Beauty & Event", "description": "Eyelash extension atau brow styling", "base_price": 180000, "image_url": ""},
    {"id": "event-001", "name": "Dekorasi Ulang Tahun", "category": "Beauty & Event", "description": "Dekorasi ulang tahun anak atau dewasa", "base_price": 500000, "image_url": ""},
    {"id": "event-002", "name": "Dekorasi Lamaran", "category": "Beauty & Event", "description": "Dekorasi acara lamaran di rumah", "base_price": 800000, "image_url": ""},
    {"id": "event-003", "name": "Dekorasi Akad / Wedding Kecil", "category": "Beauty & Event", "description": "Dekorasi akad nikah atau wedding kecil", "base_price": 1500000, "image_url": ""},
    {"id": "event-004", "name": "Dekorasi Bridal Shower", "category": "Beauty & Event", "description": "Dekorasi bridal shower", "base_price": 600000, "image_url": ""},
    {"id": "event-005", "name": "Dekorasi Baby Shower", "category": "Beauty & Event", "description": "Dekorasi baby shower", "base_price": 550000, "image_url": ""},
    {"id": "event-006", "name": "Dekorasi Grand Opening", "category": "Beauty & Event", "description": "Dekorasi grand opening toko/usaha", "base_price": 700000, "image_url": ""},
    {"id": "event-007", "name": "Dekorasi Booth / Bazaar", "category": "Beauty & Event", "description": "Dekorasi booth untuk bazaar atau pameran", "base_price": 300000, "image_url": ""},
    {"id": "event-008", "name": "Backdrop Event", "category": "Beauty & Event", "description": "Backdrop untuk acara atau foto", "base_price": 400000, "image_url": ""},
    {"id": "event-009", "name": "Balon Dekorasi", "category": "Beauty & Event", "description": "Dekorasi balon untuk berbagai acara", "base_price": 200000, "image_url": ""},
    {"id": "event-010", "name": "Table Setting", "category": "Beauty & Event", "description": "Dekorasi meja untuk acara", "base_price": 150000, "image_url": ""},
    {"id": "event-011", "name": "Sewa Properti Dekorasi", "category": "Beauty & Event", "description": "Sewa properti dekorasi event", "base_price": 250000, "image_url": ""},

    # 8. Pet Care (4 services)
    {"id": "pet-001", "name": "Grooming Hewan", "category": "Pet Care", "description": "Grooming hewan peliharaan di rumah", "base_price": 100000, "image_url": ""},
    {"id": "pet-002", "name": "Pet Visit", "category": "Pet Care", "description": "Kunjungan rutin untuk jaga hewan peliharaan", "base_price": 80000, "image_url": ""},
    {"id": "pet-003", "name": "Pet Walking", "category": "Pet Care", "description": "Jasa ajak jalan-jalan hewan peliharaan", "base_price": 50000, "image_url": ""},
    {"id": "pet-004", "name": "Cleaning Pet Area", "category": "Pet Care", "description": "Bersihkan kandang atau area hewan", "base_price": 70000, "image_url": ""},
]


# Technicians data (same as before, just add more specializations)
TECHNICIANS_DATA = [
    {"id": "tech-001", "name": "Budi Santoso", "photo_url": "https://i.pravatar.cc/150?img=12", "specialization": "Teknisi AC", "rating": 4.8, "reviews_count": 127, "distance": 1.5, "transportation_fee_min": 15000, "transportation_fee_max": 25000, "verified": True, "available_services": ["ac-001", "ac-002", "ac-003", "ac-004"]},
    {"id": "tech-002", "name": "Ahmad Hidayat", "photo_url": "https://i.pravatar.cc/150?img=13", "specialization": "Teknisi Plumbing", "rating": 4.9, "reviews_count": 203, "distance": 0.8, "transportation_fee_min": 10000, "transportation_fee_max": 20000, "verified": True, "available_services": ["plumb-001", "plumb-002", "plumb-003", "plumb-004", "plumb-005"]},
    {"id": "tech-003", "name": "Siti Nurjanah", "photo_url": "https://i.pravatar.cc/150?img=5", "specialization": "Cleaning Specialist", "rating": 4.7, "reviews_count": 156, "distance": 2.1, "transportation_fee_min": 20000, "transportation_fee_max": 30000, "verified": True, "available_services": ["clean-001", "clean-002", "clean-003", "clean-004", "clean-005"]},
    {"id": "tech-004", "name": "Rudi Wijaya", "photo_url": "https://i.pravatar.cc/150?img=15", "specialization": "Teknisi Listrik", "rating": 4.9, "reviews_count": 189, "distance": 1.2, "transportation_fee_min": 15000, "transportation_fee_max": 25000, "verified": True, "available_services": ["listrik-001", "listrik-002", "listrik-003", "listrik-004", "listrik-005"]},
    {"id": "tech-005", "name": "Dewi Kartika", "photo_url": "https://i.pravatar.cc/150?img=9", "specialization": "MUA Professional", "rating": 4.8, "reviews_count": 241, "distance": 3.5, "transportation_fee_min": 25000, "transportation_fee_max": 40000, "verified": True, "available_services": ["beauty-001", "beauty-002", "beauty-003", "beauty-004", "beauty-005", "beauty-006", "beauty-007"]},
    {"id": "tech-006", "name": "Eko Prasetyo", "photo_url": "https://i.pravatar.cc/150?img=33", "specialization": "Teknisi CCTV", "rating": 4.6, "reviews_count": 98, "distance": 4.2, "transportation_fee_min": 30000, "transportation_fee_max": 50000, "verified": True, "available_services": ["cctv-001", "cctv-002", "cctv-003", "cctv-004"]},
    {"id": "tech-007", "name": "Rina Melati", "photo_url": "https://i.pravatar.cc/150?img=10", "specialization": "Pet Groomer", "rating": 4.9, "reviews_count": 167, "distance": 2.8, "transportation_fee_min": 20000, "transportation_fee_max": 35000, "verified": True, "available_services": ["pet-001", "pet-002", "pet-003", "pet-004"]},
    {"id": "tech-008", "name": "Joko Susilo", "photo_url": "https://i.pravatar.cc/150?img=51", "specialization": "Tukang Bangunan", "rating": 4.7, "reviews_count": 134, "distance": 1.9, "transportation_fee_min": 20000, "transportation_fee_max": 30000, "verified": True, "available_services": ["reno-001", "reno-003", "reno-005", "reno-007", "reno-009", "reno-010"]},
    {"id": "tech-009", "name": "Agus Tukang Las", "photo_url": "https://i.pravatar.cc/150?img=68", "specialization": "Tukang Las", "rating": 4.8, "reviews_count": 156, "distance": 2.5, "transportation_fee_min": 25000, "transportation_fee_max": 40000, "verified": True, "available_services": ["reno-002", "reno-003", "reno-004"]},
    {"id": "tech-010", "name": "Hendra Angkut", "photo_url": "https://i.pravatar.cc/150?img=52", "specialization": "Jasa Pindahan", "rating": 4.6, "reviews_count": 102, "distance": 3.2, "transportation_fee_min": 30000, "transportation_fee_max": 50000, "verified": True, "available_services": ["move-001", "move-002", "move-003", "move-004", "move-005", "move-006"]},
    {"id": "tech-011", "name": "Lina Dekorator", "photo_url": "https://i.pravatar.cc/150?img=20", "specialization": "Event Decorator", "rating": 4.9, "reviews_count": 213, "distance": 4.5, "transportation_fee_min": 35000, "transportation_fee_max": 60000, "verified": True, "available_services": ["event-001", "event-002", "event-003", "event-004", "event-005", "event-006", "event-007", "event-008"]},
    {"id": "tech-012", "name": "Farhan Pest Control", "photo_url": "https://i.pravatar.cc/150?img=59", "specialization": "Pest Control", "rating": 4.7, "reviews_count": 89, "distance": 3.8, "transportation_fee_min": 30000, "transportation_fee_max": 50000, "verified": True, "available_services": ["pest-001", "pest-002", "pest-003", "pest-004"]},
    {"id": "tech-013", "name": "Maya Cleaning Pro", "photo_url": "https://i.pravatar.cc/150?img=45", "specialization": "Deep Cleaning", "rating": 4.8, "reviews_count": 178, "distance": 2.3, "transportation_fee_min": 20000, "transportation_fee_max": 35000, "verified": True, "available_services": ["clean-002", "clean-006", "move-007", "move-008", "move-009", "reno-012"]},
    {"id": "tech-014", "name": "Pak Tono Atap", "photo_url": "https://i.pravatar.cc/150?img=61", "specialization": "Tukang Atap", "rating": 4.6, "reviews_count": 94, "distance": 2.7, "transportation_fee_min": 25000, "transportation_fee_max": 40000, "verified": True, "available_services": ["reno-005", "reno-006", "reno-011", "reno-013"]},
]


# Activities data (mock social proof)
ACTIVITIES_DATA = [
    {"id": "act-001", "customer_name": "Ibu Ratna", "customer_avatar": "https://i.pravatar.cc/100?img=1", "service_name": "Cuci AC", "technician_id": "tech-001", "technician_name": "Budi Santoso", "technician_photo": "https://i.pravatar.cc/100?img=12", "area": "Margonda", "minutes_ago": 5, "status": "completed"},
    {"id": "act-002", "customer_name": "Pak Hendra", "customer_avatar": "https://i.pravatar.cc/100?img=3", "service_name": "Perbaikan Toilet", "technician_id": "tech-002", "technician_name": "Ahmad Hidayat", "technician_photo": "https://i.pravatar.cc/100?img=13", "area": "Beji", "minutes_ago": 12, "status": "completed"},
    {"id": "act-003", "customer_name": "Mbak Sari", "customer_avatar": "https://i.pravatar.cc/100?img=5", "service_name": "Deep Cleaning", "technician_id": "tech-003", "technician_name": "Siti Nurjanah", "technician_photo": "https://i.pravatar.cc/100?img=5", "area": "Kukusan", "minutes_ago": 18, "status": "completed"},
    {"id": "act-004", "customer_name": "Bapak Joko", "customer_avatar": "https://i.pravatar.cc/100?img=7", "service_name": "Instalasi CCTV", "technician_id": "tech-006", "technician_name": "Eko Prasetyo", "technician_photo": "https://i.pravatar.cc/100?img=33", "area": "Limo", "minutes_ago": 25, "status": "completed"},
    {"id": "act-005", "customer_name": "Ibu Dewi", "customer_avatar": "https://i.pravatar.cc/100?img=9", "service_name": "Makeup Wisuda", "technician_id": "tech-005", "technician_name": "Dewi Kartika", "technician_photo": "https://i.pravatar.cc/100?img=9", "area": "UI Depok", "minutes_ago": 32, "status": "completed"},
    {"id": "act-006", "customer_name": "Pak Ridwan", "customer_avatar": "https://i.pravatar.cc/100?img=11", "service_name": "Pindahan Kos", "technician_id": "tech-010", "technician_name": "Hendra Angkut", "technician_photo": "https://i.pravatar.cc/100?img=52", "area": "Citayam", "minutes_ago": 45, "status": "completed"},
    {"id": "act-007", "customer_name": "Mbak Lina", "customer_avatar": "https://i.pravatar.cc/100?img=16", "service_name": "Dekorasi Ulang Tahun", "technician_id": "tech-011", "technician_name": "Lina Dekorator", "technician_photo": "https://i.pravatar.cc/100?img=20", "area": "Pancoran Mas", "minutes_ago": 52, "status": "completed"},
    {"id": "act-008", "customer_name": "Pak Agung", "customer_avatar": "https://i.pravatar.cc/100?img=33", "service_name": "Cat Rumah", "technician_id": "tech-008", "technician_name": "Joko Susilo", "technician_photo": "https://i.pravatar.cc/100?img=51", "area": "Sawangan", "minutes_ago": 67, "status": "completed"},
    {"id": "act-009", "customer_name": "Ibu Ningsih", "customer_avatar": "https://i.pravatar.cc/100?img=20", "service_name": "Grooming Kucing", "technician_id": "tech-007", "technician_name": "Rina Melati", "technician_photo": "https://i.pravatar.cc/100?img=10", "area": "Cinere", "minutes_ago": 78, "status": "completed"},
    {"id": "act-010", "customer_name": "Pak Benny", "customer_avatar": "https://i.pravatar.cc/100?img=51", "service_name": "Anti Rayap", "technician_id": "tech-012", "technician_name": "Farhan Pest Control", "technician_photo": "https://i.pravatar.cc/100?img=59", "area": "Sukmajaya", "minutes_ago": 89, "status": "completed"},
    {"id": "act-011", "customer_name": "Mbak Tari", "customer_avatar": "https://i.pravatar.cc/100?img=26", "service_name": "Perbaikan Listrik", "technician_id": "tech-004", "technician_name": "Rudi Wijaya", "technician_photo": "https://i.pravatar.cc/100?img=15", "area": "Cilodong", "minutes_ago": 102, "status": "completed"},
    {"id": "act-012", "customer_name": "Ibu Rini", "customer_avatar": "https://i.pravatar.cc/100?img=44", "service_name": "Tukang Las Pagar", "technician_id": "tech-009", "technician_name": "Agus Tukang Las", "technician_photo": "https://i.pravatar.cc/100?img=68", "area": "Cinangka", "minutes_ago": 118, "status": "completed"},
]


async def seed_database():
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    print("🗑️  Clearing existing data...")
    await db.categories.delete_many({})
    await db.services.delete_many({})
    await db.technicians.delete_many({})
    await db.activities.delete_many({})
    await db.orders.delete_many({})
    await db.reviews.delete_many({})
    await db.conversations.delete_many({})
    await db.messages.delete_many({})
    await db.bantuin_requests.delete_many({})
    await db.helper_offers.delete_many({})
    await db.war_tiket_requests.delete_many({})
    
    # Insert categories
    print(f"📂 Inserting {len(CATEGORIES_DATA)} categories...")
    await db.categories.insert_many(CATEGORIES_DATA)
    
    # Insert services
    print(f"📦 Inserting {len(SERVICES_DATA)} services...")
    await db.services.insert_many(SERVICES_DATA)
    
    # Insert technicians
    print(f"👷 Inserting {len(TECHNICIANS_DATA)} technicians...")
    await db.technicians.insert_many(TECHNICIANS_DATA)
    
    # Insert activities
    print(f"📊 Inserting {len(ACTIVITIES_DATA)} activities...")
    await db.activities.insert_many(ACTIVITIES_DATA)
    
    print("✅ Database seeding completed!")
    print(f"   - {len(CATEGORIES_DATA)} categories added")
    print(f"   - {len(SERVICES_DATA)} services added")
    print(f"   - {len(TECHNICIANS_DATA)} technicians added")
    print(f"   - {len(ACTIVITIES_DATA)} activities added")


if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()
