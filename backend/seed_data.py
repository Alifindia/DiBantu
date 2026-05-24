"""
Seed data script for TemuJasa application
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


# Categories with their common issues
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
        "id": "Cleaning",
        "name": "Cleaning",
        "full_name": "Home Cleaning",
        "icon": "sparkles",
        "color": "purple",
        "common_issues": ["Rumah kotor", "Noda membandel", "Bau tidak sedap", "Debu menumpuk"]
    },
    {
        "id": "Listrik",
        "name": "Listrik",
        "full_name": "Electrical Services",
        "icon": "zap",
        "color": "yellow",
        "common_issues": ["MCB turun", "Konslet", "Lampu mati", "Stop kontak rusak"]
    },
    {
        "id": "Pet Care",
        "name": "Pet Care",
        "full_name": "Pet Home Care",
        "icon": "dog",
        "color": "pink",
        "common_issues": ["Bulu rontok", "Hewan bau", "Kandang kotor", "Owner keluar kota"]
    },
    {
        "id": "Pest Control",
        "name": "Pest Control",
        "full_name": "Pest Control",
        "icon": "bug",
        "color": "red",
        "common_issues": ["Banyak kecoa", "Tikus di rumah", "Rayap kayu", "Nyamuk berlebih"]
    },
    {
        "id": "Smart Home",
        "name": "Smart Home",
        "full_name": "Smart Home & CCTV",
        "icon": "camera",
        "color": "indigo",
        "common_issues": ["CCTV offline", "WiFi tidak stabil", "Smart device error"]
    }
]


# Services data based on user requirements
SERVICES_DATA = [
    # A. AC & Air Conditioning
    {
        "id": "srv-ac-001",
        "name": "Cuci & Maintenance AC",
        "category": "AC",
        "description": "Bersihkan AC agar udara lebih sejuk & hemat listrik.",
        "base_price": 75000,
        "image_url": "https://images.unsplash.com/photo-1631545806609-4b0e57c3e912?w=400"
    },
    {
        "id": "srv-ac-002",
        "name": "Isi Freon AC",
        "category": "AC",
        "description": "Isi ulang freon AC agar pendinginan kembali optimal.",
        "base_price": 250000,
        "image_url": "https://images.unsplash.com/photo-1631545806609-4b0e57c3e912?w=400"
    },
    {
        "id": "srv-ac-003",
        "name": "Perbaikan AC",
        "category": "AC",
        "description": "Perbaikan AC tidak dingin, berisik, bocor, dll.",
        "base_price": 125000,
        "image_url": "https://images.unsplash.com/photo-1631545806609-4b0e57c3e912?w=400"
    },
    {
        "id": "srv-ac-004",
        "name": "Bongkar Pasang AC",
        "category": "AC",
        "description": "Bongkar pasang AC lama atau pindah lokasi.",
        "base_price": 120000,
        "image_url": "https://images.unsplash.com/photo-1631545806609-4b0e57c3e912?w=400"
    },

    # B. Plumbing & Water System
    {
        "id": "srv-plumbing-001",
        "name": "Perbaikan Saluran Mampet",
        "category": "Plumbing",
        "description": "Atasi saluran air mampet dengan peralatan profesional.",
        "base_price": 110000,
        "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400"
    },
    {
        "id": "srv-plumbing-002",
        "name": "Perbaikan Kebocoran",
        "category": "Plumbing",
        "description": "Atasi kebocoran pipa air, kran, dan saluran air.",
        "base_price": 90000,
        "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400"
    },
    {
        "id": "srv-plumbing-003",
        "name": "Service Toilet & Wastafel",
        "category": "Plumbing",
        "description": "Perbaikan dan pemasangan toilet, wastafel, dan sanitasi.",
        "base_price": 95000,
        "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400"
    },
    {
        "id": "srv-plumbing-004",
        "name": "Service Pompa Air",
        "category": "Plumbing",
        "description": "Perbaikan dan instalasi pompa air rumah.",
        "base_price": 150000,
        "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400"
    },
    {
        "id": "srv-plumbing-005",
        "name": "Instalasi Pipa & Air",
        "category": "Plumbing",
        "description": "Pemasangan jalur pipa air bersih dan kotor.",
        "base_price": 180000,
        "image_url": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400"
    },

    # C. Home Cleaning
    {
        "id": "srv-cleaning-001",
        "name": "General Cleaning",
        "category": "Cleaning",
        "description": "Pembersihan rumah secara umum (sapu, pel, lap).",
        "base_price": 80000,
        "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
    },
    {
        "id": "srv-cleaning-002",
        "name": "Deep Cleaning",
        "category": "Cleaning",
        "description": "Pembersihan menyeluruh termasuk jendela, lemari, dll.",
        "base_price": 150000,
        "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
    },
    {
        "id": "srv-cleaning-003",
        "name": "Cleaning Kamar Mandi",
        "category": "Cleaning",
        "description": "Pembersihan menyeluruh kamar mandi dan toilet.",
        "base_price": 70000,
        "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
    },
    {
        "id": "srv-cleaning-004",
        "name": "Cleaning Sofa & Kasur",
        "category": "Cleaning",
        "description": "Steam cleaning sofa, kasur, dan furniture berbahan kain.",
        "base_price": 120000,
        "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
    },
    {
        "id": "srv-cleaning-005",
        "name": "Cleaning Kantor & Kos",
        "category": "Cleaning",
        "description": "Pembersihan kantor, kos, atau ruko menyeluruh.",
        "base_price": 130000,
        "image_url": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400"
    },

    # D. Electrical Services
    {
        "id": "srv-listrik-001",
        "name": "Perbaikan Kelistrikan",
        "category": "Listrik",
        "description": "Perbaikan MCB trip, korsleting, dan masalah kelistrikan.",
        "base_price": 85000,
        "image_url": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400"
    },
    {
        "id": "srv-listrik-002",
        "name": "Instalasi Listrik",
        "category": "Listrik",
        "description": "Instalasi listrik baru, tambah stop kontak, switch lampu.",
        "base_price": 100000,
        "image_url": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400"
    },
    {
        "id": "srv-listrik-003",
        "name": "Perbaikan Lampu & Saklar",
        "category": "Listrik",
        "description": "Pemasangan & perbaikan lampu, saklar, dan fitting.",
        "base_price": 60000,
        "image_url": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400"
    },
    {
        "id": "srv-listrik-004",
        "name": "Perbaikan Stop Kontak",
        "category": "Listrik",
        "description": "Perbaikan dan penggantian stop kontak rusak.",
        "base_price": 55000,
        "image_url": "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400"
    },

    # E. Pet Home Care
    {
        "id": "srv-pet-001",
        "name": "Grooming Hewan",
        "category": "Pet Care",
        "description": "Mandi, potong kuku, dan grooming untuk anjing/kucing.",
        "base_price": 85000,
        "image_url": "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400"
    },
    {
        "id": "srv-pet-002",
        "name": "Pet Visit",
        "category": "Pet Care",
        "description": "Kunjungan untuk merawat hewan saat owner sibuk.",
        "base_price": 70000,
        "image_url": "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400"
    },
    {
        "id": "srv-pet-003",
        "name": "Pet Walking",
        "category": "Pet Care",
        "description": "Ajak jalan-jalan anjing peliharaan Anda.",
        "base_price": 60000,
        "image_url": "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400"
    },
    {
        "id": "srv-pet-004",
        "name": "Cleaning Pet Area",
        "category": "Pet Care",
        "description": "Pembersihan kandang dan area khusus hewan peliharaan.",
        "base_price": 90000,
        "image_url": "https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=400"
    },

    # F. Pest Control
    {
        "id": "srv-pest-001",
        "name": "Anti Rayap",
        "category": "Pest Control",
        "description": "Pembasmian rayap kayu & furniture menggunakan bahan aman.",
        "base_price": 250000,
        "image_url": "https://images.unsplash.com/photo-1632935190508-c5e1cd0a5e72?w=400"
    },
    {
        "id": "srv-pest-002",
        "name": "Anti Serangga & Kecoa",
        "category": "Pest Control",
        "description": "Bebas kecoa dan serangga dengan spray profesional.",
        "base_price": 180000,
        "image_url": "https://images.unsplash.com/photo-1632935190508-c5e1cd0a5e72?w=400"
    },
    {
        "id": "srv-pest-003",
        "name": "Anti Tikus",
        "category": "Pest Control",
        "description": "Pembasmian tikus di rumah dengan metode aman.",
        "base_price": 200000,
        "image_url": "https://images.unsplash.com/photo-1632935190508-c5e1cd0a5e72?w=400"
    },
    {
        "id": "srv-pest-004",
        "name": "Fogging",
        "category": "Pest Control",
        "description": "Fogging anti nyamuk untuk lingkungan bebas DBD.",
        "base_price": 220000,
        "image_url": "https://images.unsplash.com/photo-1632935190508-c5e1cd0a5e72?w=400"
    },

    # G. Smart Home & CCTV
    {
        "id": "srv-smart-001",
        "name": "Instalasi CCTV",
        "category": "Smart Home",
        "description": "Pemasangan & setup CCTV untuk keamanan rumah.",
        "base_price": 300000,
        "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400"
    },
    {
        "id": "srv-smart-002",
        "name": "Setup WiFi",
        "category": "Smart Home",
        "description": "Setup, perbaikan, atau ekspansi jaringan WiFi rumah.",
        "base_price": 150000,
        "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400"
    },
    {
        "id": "srv-smart-003",
        "name": "Instalasi Smart Lock",
        "category": "Smart Home",
        "description": "Pemasangan smart lock pintu rumah dengan fingerprint/app.",
        "base_price": 200000,
        "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400"
    },
    {
        "id": "srv-smart-004",
        "name": "Instalasi Smart Lamp",
        "category": "Smart Home",
        "description": "Setup smart lamp & otomasi lampu pintar.",
        "base_price": 120000,
        "image_url": "https://images.unsplash.com/photo-1558002038-1055907df827?w=400"
    },
]


# Technicians data - expanded for all 7 categories
TECHNICIANS_DATA = [
    {
        "id": "tech-001",
        "name": "Pak Dedi",
        "photo_url": "https://i.pravatar.cc/150?img=12",
        "specialization": "Spesialis AC",
        "rating": 4.9,
        "reviews_count": 320,
        "distance": 2.1,
        "transportation_fee_min": 10000,
        "transportation_fee_max": 13000,
        "verified": True,
        "available_services": ["srv-ac-001", "srv-ac-002", "srv-ac-003", "srv-ac-004"]
    },
    {
        "id": "tech-002",
        "name": "Pak Joko",
        "photo_url": "https://i.pravatar.cc/150?img=13",
        "specialization": "Spesialis AC",
        "rating": 4.8,
        "reviews_count": 256,
        "distance": 1.8,
        "transportation_fee_min": 10000,
        "transportation_fee_max": 13000,
        "verified": True,
        "available_services": ["srv-ac-001", "srv-ac-002", "srv-ac-003", "srv-ac-004"]
    },
    {
        "id": "tech-003",
        "name": "Pak Budi",
        "photo_url": "https://i.pravatar.cc/150?img=33",
        "specialization": "Spesialis AC",
        "rating": 4.7,
        "reviews_count": 180,
        "distance": 2.4,
        "transportation_fee_min": 10000,
        "transportation_fee_max": 13000,
        "verified": True,
        "available_services": ["srv-ac-001", "srv-ac-002", "srv-ac-003", "srv-ac-004"]
    },
    {
        "id": "tech-004",
        "name": "Pak Agus",
        "photo_url": "https://i.pravatar.cc/150?img=51",
        "specialization": "Spesialis Listrik",
        "rating": 4.9,
        "reviews_count": 412,
        "distance": 1.5,
        "transportation_fee_min": 8000,
        "transportation_fee_max": 12000,
        "verified": True,
        "available_services": ["srv-listrik-001", "srv-listrik-002", "srv-listrik-003", "srv-listrik-004"]
    },
    {
        "id": "tech-005",
        "name": "Pak Hendra",
        "photo_url": "https://i.pravatar.cc/150?img=52",
        "specialization": "Spesialis Listrik",
        "rating": 4.6,
        "reviews_count": 178,
        "distance": 2.8,
        "transportation_fee_min": 10000,
        "transportation_fee_max": 15000,
        "verified": True,
        "available_services": ["srv-listrik-001", "srv-listrik-002", "srv-listrik-003", "srv-listrik-004"]
    },
    {
        "id": "tech-006",
        "name": "Pak Andi",
        "photo_url": "https://i.pravatar.cc/150?img=68",
        "specialization": "Spesialis Plumbing",
        "rating": 4.8,
        "reviews_count": 287,
        "distance": 1.9,
        "transportation_fee_min": 10000,
        "transportation_fee_max": 14000,
        "verified": True,
        "available_services": ["srv-plumbing-001", "srv-plumbing-002", "srv-plumbing-003", "srv-plumbing-004", "srv-plumbing-005"]
    },
    {
        "id": "tech-007",
        "name": "Pak Rudi",
        "photo_url": "https://i.pravatar.cc/150?img=69",
        "specialization": "Spesialis Plumbing",
        "rating": 4.7,
        "reviews_count": 201,
        "distance": 2.4,
        "transportation_fee_min": 11000,
        "transportation_fee_max": 16000,
        "verified": True,
        "available_services": ["srv-plumbing-001", "srv-plumbing-002", "srv-plumbing-003", "srv-plumbing-004", "srv-plumbing-005"]
    },
    {
        "id": "tech-008",
        "name": "Ibu Siti",
        "photo_url": "https://i.pravatar.cc/150?img=47",
        "specialization": "Spesialis Cleaning",
        "rating": 4.9,
        "reviews_count": 534,
        "distance": 1.2,
        "transportation_fee_min": 5000,
        "transportation_fee_max": 10000,
        "verified": True,
        "available_services": ["srv-cleaning-001", "srv-cleaning-002", "srv-cleaning-003", "srv-cleaning-004", "srv-cleaning-005"]
    },
    {
        "id": "tech-009",
        "name": "Ibu Wati",
        "photo_url": "https://i.pravatar.cc/150?img=48",
        "specialization": "Spesialis Cleaning",
        "rating": 4.8,
        "reviews_count": 445,
        "distance": 2.0,
        "transportation_fee_min": 7000,
        "transportation_fee_max": 12000,
        "verified": True,
        "available_services": ["srv-cleaning-001", "srv-cleaning-002", "srv-cleaning-003", "srv-cleaning-004", "srv-cleaning-005"]
    },
    {
        "id": "tech-010",
        "name": "Pak Irfan",
        "photo_url": "https://i.pravatar.cc/150?img=70",
        "specialization": "Spesialis Pet Care",
        "rating": 4.9,
        "reviews_count": 298,
        "distance": 2.3,
        "transportation_fee_min": 12000,
        "transportation_fee_max": 18000,
        "verified": True,
        "available_services": ["srv-pet-001", "srv-pet-002", "srv-pet-003", "srv-pet-004"]
    },
    {
        "id": "tech-011",
        "name": "Pak Slamet",
        "photo_url": "https://i.pravatar.cc/150?img=53",
        "specialization": "Spesialis Pest Control",
        "rating": 4.8,
        "reviews_count": 215,
        "distance": 2.6,
        "transportation_fee_min": 15000,
        "transportation_fee_max": 25000,
        "verified": True,
        "available_services": ["srv-pest-001", "srv-pest-002", "srv-pest-003", "srv-pest-004"]
    },
    {
        "id": "tech-012",
        "name": "Pak Bambang",
        "photo_url": "https://i.pravatar.cc/150?img=54",
        "specialization": "Spesialis Pest Control",
        "rating": 4.7,
        "reviews_count": 167,
        "distance": 3.1,
        "transportation_fee_min": 15000,
        "transportation_fee_max": 25000,
        "verified": True,
        "available_services": ["srv-pest-001", "srv-pest-002", "srv-pest-003", "srv-pest-004"]
    },
    {
        "id": "tech-013",
        "name": "Pak Fajar",
        "photo_url": "https://i.pravatar.cc/150?img=14",
        "specialization": "Spesialis Smart Home",
        "rating": 4.9,
        "reviews_count": 189,
        "distance": 2.0,
        "transportation_fee_min": 12000,
        "transportation_fee_max": 20000,
        "verified": True,
        "available_services": ["srv-smart-001", "srv-smart-002", "srv-smart-003", "srv-smart-004"]
    },
    {
        "id": "tech-014",
        "name": "Pak Rian",
        "photo_url": "https://i.pravatar.cc/150?img=15",
        "specialization": "Spesialis Smart Home & CCTV",
        "rating": 4.8,
        "reviews_count": 142,
        "distance": 2.5,
        "transportation_fee_min": 12000,
        "transportation_fee_max": 22000,
        "verified": True,
        "available_services": ["srv-smart-001", "srv-smart-002", "srv-smart-003", "srv-smart-004"]
    },
]


async def seed_database():
    """Seed the database with initial data"""
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    print("🗑️  Clearing existing data...")
    await db.services.delete_many({})
    await db.technicians.delete_many({})
    await db.categories.delete_many({})
    await db.orders.delete_many({})
    await db.reviews.delete_many({})
    await db.conversations.delete_many({})
    await db.messages.delete_many({})
    
    # Insert categories
    print(f"📂 Inserting {len(CATEGORIES_DATA)} categories...")
    await db.categories.insert_many(CATEGORIES_DATA)
    
    # Insert services
    print(f"📦 Inserting {len(SERVICES_DATA)} services...")
    await db.services.insert_many(SERVICES_DATA)
    
    # Insert technicians
    print(f"👷 Inserting {len(TECHNICIANS_DATA)} technicians...")
    await db.technicians.insert_many(TECHNICIANS_DATA)
    
    # Seed sample conversations
    print("💬 Inserting sample conversations...")
    from datetime import datetime, timezone
    import uuid
    
    sample_convs = [
        {
            "id": str(uuid.uuid4()),
            "technician_id": "tech-001",
            "technician_name": "Pak Dedi",
            "technician_photo": "https://i.pravatar.cc/150?img=12",
            "technician_specialization": "Spesialis AC",
            "last_message": "Baik, saya akan segera ke lokasi Anda. Mohon ditunggu ya.",
            "last_message_time": datetime.now(timezone.utc).isoformat(),
            "unread_count": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "technician_id": "tech-008",
            "technician_name": "Ibu Siti",
            "technician_photo": "https://i.pravatar.cc/150?img=47",
            "technician_specialization": "Spesialis Cleaning",
            "last_message": "Terima kasih sudah memberikan rating! Senang bisa membantu.",
            "last_message_time": datetime.now(timezone.utc).isoformat(),
            "unread_count": 0,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.conversations.insert_many(sample_convs)
    
    # Insert sample messages
    sample_messages = []
    # Conv 1 with Pak Dedi
    conv1_id = sample_convs[0]['id']
    sample_messages.extend([
        {"id": str(uuid.uuid4()), "conversation_id": conv1_id, "sender": "user", "text": "Halo Pak Dedi, kapan bisa ke lokasi?", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "conversation_id": conv1_id, "sender": "technician", "text": "Halo! Saya bisa hari ini sekitar jam 2 siang.", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "conversation_id": conv1_id, "sender": "user", "text": "Oke baik, saya tunggu ya pak.", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "conversation_id": conv1_id, "sender": "technician", "text": "Baik, saya akan segera ke lokasi Anda. Mohon ditunggu ya.", "created_at": datetime.now(timezone.utc).isoformat()},
    ])
    # Conv 2 with Ibu Siti
    conv2_id = sample_convs[1]['id']
    sample_messages.extend([
        {"id": str(uuid.uuid4()), "conversation_id": conv2_id, "sender": "user", "text": "Bu Siti, hasil cleaningnya bagus banget!", "created_at": datetime.now(timezone.utc).isoformat()},
        {"id": str(uuid.uuid4()), "conversation_id": conv2_id, "sender": "technician", "text": "Terima kasih sudah memberikan rating! Senang bisa membantu.", "created_at": datetime.now(timezone.utc).isoformat()},
    ])
    await db.messages.insert_many(sample_messages)
    
    # Seed sample activities (social proof feed for Depok)
    print("📊 Inserting recent activities...")
    activities_data = [
        {"id": str(uuid.uuid4()), "customer_name": "Budi M.", "customer_avatar": "https://i.pravatar.cc/100?img=11", "service_name": "Cuci & Maintenance AC", "technician_id": "tech-001", "technician_name": "Pak Dedi", "technician_photo": "https://i.pravatar.cc/150?img=12", "area": "Depok Margonda", "minutes_ago": 3, "status": "in_progress"},
        {"id": str(uuid.uuid4()), "customer_name": "Sari W.", "customer_avatar": "https://i.pravatar.cc/100?img=45", "service_name": "Perbaikan Saluran Mampet", "technician_id": "tech-006", "technician_name": "Pak Andi", "technician_photo": "https://i.pravatar.cc/150?img=68", "area": "Depok Sawangan", "minutes_ago": 7, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Andi P.", "customer_avatar": "https://i.pravatar.cc/100?img=22", "service_name": "Service AC", "technician_id": "tech-002", "technician_name": "Pak Joko", "technician_photo": "https://i.pravatar.cc/150?img=13", "area": "Depok Cinere", "minutes_ago": 11, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Lina K.", "customer_avatar": "https://i.pravatar.cc/100?img=44", "service_name": "Deep Cleaning", "technician_id": "tech-008", "technician_name": "Ibu Siti", "technician_photo": "https://i.pravatar.cc/150?img=47", "area": "Depok Beji", "minutes_ago": 14, "status": "in_progress"},
        {"id": str(uuid.uuid4()), "customer_name": "Rendi A.", "customer_avatar": "https://i.pravatar.cc/100?img=33", "service_name": "Perbaikan Kelistrikan", "technician_id": "tech-004", "technician_name": "Pak Agus", "technician_photo": "https://i.pravatar.cc/150?img=51", "area": "Depok Pancoran Mas", "minutes_ago": 18, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Dewi S.", "customer_avatar": "https://i.pravatar.cc/100?img=49", "service_name": "Pet Grooming", "technician_id": "tech-010", "technician_name": "Pak Irfan", "technician_photo": "https://i.pravatar.cc/150?img=70", "area": "Depok Cimanggis", "minutes_ago": 23, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Tono H.", "customer_avatar": "https://i.pravatar.cc/100?img=66", "service_name": "Anti Rayap", "technician_id": "tech-011", "technician_name": "Pak Slamet", "technician_photo": "https://i.pravatar.cc/150?img=53", "area": "Depok Tapos", "minutes_ago": 28, "status": "in_progress"},
        {"id": str(uuid.uuid4()), "customer_name": "Mira L.", "customer_avatar": "https://i.pravatar.cc/100?img=24", "service_name": "Instalasi CCTV", "technician_id": "tech-013", "technician_name": "Pak Fajar", "technician_photo": "https://i.pravatar.cc/150?img=14", "area": "Depok Cilodong", "minutes_ago": 35, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Hadi R.", "customer_avatar": "https://i.pravatar.cc/100?img=58", "service_name": "Pasang AC", "technician_id": "tech-003", "technician_name": "Pak Budi", "technician_photo": "https://i.pravatar.cc/150?img=33", "area": "Depok Limo", "minutes_ago": 42, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Nina K.", "customer_avatar": "https://i.pravatar.cc/100?img=27", "service_name": "Cleaning Sofa & Kasur", "technician_id": "tech-009", "technician_name": "Ibu Wati", "technician_photo": "https://i.pravatar.cc/150?img=48", "area": "Depok Bojongsari", "minutes_ago": 48, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Ari S.", "customer_avatar": "https://i.pravatar.cc/100?img=15", "service_name": "Setup WiFi", "technician_id": "tech-014", "technician_name": "Pak Rian", "technician_photo": "https://i.pravatar.cc/150?img=15", "area": "Depok Sukmajaya", "minutes_ago": 55, "status": "completed"},
        {"id": str(uuid.uuid4()), "customer_name": "Yanti M.", "customer_avatar": "https://i.pravatar.cc/100?img=29", "service_name": "Fogging", "technician_id": "tech-012", "technician_name": "Pak Bambang", "technician_photo": "https://i.pravatar.cc/150?img=54", "area": "Depok Cipayung", "minutes_ago": 62, "status": "completed"},
    ]
    await db.activities.delete_many({})
    await db.activities.insert_many(activities_data)
    
    print("✅ Database seeding completed!")
    print(f"   - {len(CATEGORIES_DATA)} categories added")
    print(f"   - {len(SERVICES_DATA)} services added")
    print(f"   - {len(TECHNICIANS_DATA)} technicians added")
    

if __name__ == "__main__":
    asyncio.run(seed_database())
    client.close()
