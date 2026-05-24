from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class ServiceCategory(str, Enum):
    AC = "AC"
    PLUMBING = "Plumbing"
    CLEANING_PEST = "Cleaning & Pest"
    LISTRIK_CCTV = "Listrik & CCTV"
    RENOVASI = "Renovasi"
    PINDAHAN_ANGKUT = "Pindahan & Angkut"
    BEAUTY_EVENT = "Beauty & Event"
    PET_CARE = "Pet Care"

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentMethod(str, Enum):
    BANK_TRANSFER = "Bank Transfer / VA"
    OVO = "OVO"
    GOPAY = "GoPay"
    CREDIT_CARD = "Kartu Kredit / Debit"


# Models
class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: ServiceCategory
    description: str
    base_price: int
    image_url: str = ""

class Technician(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    photo_url: str
    specialization: str
    rating: float
    reviews_count: int
    distance: float  # in km
    transportation_fee_min: int
    transportation_fee_max: int
    verified: bool = True
    available_services: List[str] = []

class TimelineEvent(BaseModel):
    event: str
    time: str
    completed: bool

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    service_id: str
    service_name: str
    service_price: int
    technician_id: str
    technician_name: str
    technician_photo: str
    address: str
    schedule: str
    status: OrderStatus
    payment_method: Optional[PaymentMethod] = None
    transportation_fee: int
    total: int
    timeline: List[TimelineEvent] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    technician_id: str
    rating: int  # 1-5
    comment: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Chat Models
class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender: str  # 'user' or 'technician'
    text: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Conversation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    technician_id: str
    technician_name: str
    technician_photo: str
    technician_specialization: str
    last_message: str = ""
    last_message_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    unread_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Request Models
class OrderCreate(BaseModel):
    service_id: str
    technician_id: str
    address: str
    schedule: str
    transportation_fee: int
    payment_method: PaymentMethod

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    timeline_event: Optional[str] = None

class ReviewCreate(BaseModel):
    order_id: str
    technician_id: str
    rating: int
    comment: str

class MessageCreate(BaseModel):
    text: str
    sender: str = 'user'

class ConversationStart(BaseModel):
    technician_id: str
    initial_message: Optional[str] = None

# Activity Model
class Activity(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_avatar: str
    service_name: str
    technician_id: str
    technician_name: str
    technician_photo: str
    area: str
    minutes_ago: int
    status: str = "completed"

# Bantuin Models (Custom Help Request)
class HelperOffer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_id: str
    helper_id: str
    helper_name: str
    helper_photo: str
    rating: float
    reviews_count: int
    distance: float
    eta_minutes: int
    price: int
    note: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BantuinRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_number: str = ""
    title: str
    detail: str
    location: str
    schedule: str
    budget: int
    photo_url: str = ""
    status: str = "searching"  # searching, helper_selected, on_the_way, in_progress, completed, cancelled
    selected_helper_id: Optional[str] = None
    selected_offer_id: Optional[str] = None
    final_price: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class BantuinCreate(BaseModel):
    title: str
    detail: str
    location: str
    schedule: str
    budget: int
    photo_url: str = ""

class BantuinSelectHelper(BaseModel):
    offer_id: str

class BantuinStatusUpdate(BaseModel):
    status: str

# War Tiket Models
class WarTiketRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    request_number: str = ""
    event_name: str
    platform_link: str
    ticket_war_datetime: str
    ticket_category: str
    ticket_quantity: int
    max_price: int
    standby_fee: int
    success_fee: int
    notes: str = ""
    status: str = "waiting"  # waiting, standby, success, failed, cancelled
    helper_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class WarTiketCreate(BaseModel):
    event_name: str
    platform_link: str
    ticket_war_datetime: str
    ticket_category: str
    ticket_quantity: int
    max_price: int
    standby_fee: int
    success_fee: int
    notes: str = ""


# Validation functions
FORBIDDEN_KEYWORDS = [
    # Keselamatan orang
    'jemput anak', 'antar anak', 'antar orang', 'jemput orang',
    'babysitter', 'jaga anak', 'rawat orang', 'caregiver', 'baby sitter',
    'driver pribadi', 'bodyguard', 'pengawal', 'satpam pribadi',
    'menemani anak', 'menjaga anak', 'mengawasi anak',
    'antar jemput', 'antarin', 'jemputin',
    'pendamping lansia', 'merawat lansia', 'caretaker',
    'perawat', 'medis', 'dokter', 'suster',
    # Jasa teknis berat
    'tukang las', 'service ac', 'ac tidak dingin', 'isi freon',
    'listrik', 'kelistrikan', 'instalasi listrik', 'mcb turun',
    'plumbing', 'tukang ledeng', 'pipa bocor', 'saluran mampet',
    'cctv', 'pasang cctv', 'instalasi cctv',
    'pest control', 'anti rayap', 'basmi rayap', 'fogging',
    'smart home', 'smart lock',
]

def validate_bantuin_request(title: str, detail: str) -> tuple[bool, str]:
    """Validate if bantuin request is allowed (not involving safety or heavy technical work)"""
    combined_text = f"{title} {detail}".lower()
    
    for keyword in FORBIDDEN_KEYWORDS:
        if keyword in combined_text:
            # Check if it's technical service
            technical_keywords = ['las', 'ac', 'listrik', 'plumbing', 'cctv', 'pest control', 'smart']
            is_technical = any(kw in keyword for kw in technical_keywords)
            
            if is_technical:
                return False, "technical"
            else:
                return False, "safety"
    
    return True, ""


# API Routes

@api_router.get("/")
async def root():
    return {"message": "DiBantu API - Service Marketplace"}

# Categories endpoint
@api_router.get("/categories")
async def get_categories():
    """Get all service categories with common issues"""
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories

# Services endpoints
@api_router.get("/services", response_model=List[Service])
async def get_services(category: Optional[str] = None):
    """Get all services or filter by category"""
    query = {}
    if category:
        query["category"] = category
    
    services = await db.services.find(query, {"_id": 0}).to_list(100)
    return services

@api_router.get("/services/category/{category}", response_model=List[Service])
async def get_services_by_category(category: str):
    """Get services by specific category"""
    services = await db.services.find({"category": category}, {"_id": 0}).to_list(100)
    return services

# Technicians endpoints
@api_router.get("/technicians", response_model=List[Technician])
async def get_technicians(
    service_id: Optional[str] = None,
    sort_by: Optional[str] = Query(None, regex="^(rating|distance|price)$")
):
    """Get all technicians with optional filters and sorting"""
    query = {}
    
    if service_id:
        query["available_services"] = service_id
    
    technicians = await db.technicians.find(query, {"_id": 0}).to_list(100)
    
    # Sort if requested
    if sort_by == "rating":
        technicians.sort(key=lambda x: x['rating'], reverse=True)
    elif sort_by == "distance":
        technicians.sort(key=lambda x: x['distance'])
    elif sort_by == "price":
        technicians.sort(key=lambda x: x['transportation_fee_min'])
    
    return technicians

@api_router.get("/technicians/{technician_id}", response_model=Technician)
async def get_technician(technician_id: str):
    """Get specific technician details"""
    technician = await db.technicians.find_one({"id": technician_id}, {"_id": 0})
    if not technician:
        raise HTTPException(status_code=404, detail="Technician not found")
    return technician

# Orders endpoints
@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate):
    """Create a new order"""
    # Get service details
    service = await db.services.find_one({"id": order_input.service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Get technician details
    technician = await db.technicians.find_one({"id": order_input.technician_id}, {"_id": 0})
    if not technician:
        raise HTTPException(status_code=404, detail="Technician not found")
    
    # Generate order number
    order_count = await db.orders.count_documents({})
    order_number = f"INV-{str(order_count + 345678).zfill(6)}"
    
    # Calculate total
    total = service['base_price'] + order_input.transportation_fee
    
    # Create order
    order = Order(
        order_number=order_number,
        service_id=order_input.service_id,
        service_name=service['name'],
        service_price=service['base_price'],
        technician_id=order_input.technician_id,
        technician_name=technician['name'],
        technician_photo=technician['photo_url'],
        address=order_input.address,
        schedule=order_input.schedule,
        status=OrderStatus.PENDING,
        payment_method=order_input.payment_method,
        transportation_fee=order_input.transportation_fee,
        total=total,
        timeline=[
            TimelineEvent(event="Pesanan dibuat", time=datetime.now(timezone.utc).strftime("%H:%M"), completed=True)
        ]
    )
    
    # Save to database
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.orders.insert_one(doc)
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(status: Optional[str] = None):
    """Get all orders with optional status filter"""
    query = {}
    if status:
        query["status"] = status
    
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Convert ISO strings back to datetime
    for order in orders:
        if isinstance(order['created_at'], str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
        if order.get('completed_at') and isinstance(order['completed_at'], str):
            order['completed_at'] = datetime.fromisoformat(order['completed_at'])
    
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get specific order details"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert ISO strings back to datetime
    if isinstance(order['created_at'], str):
        order['created_at'] = datetime.fromisoformat(order['created_at'])
    if order.get('completed_at') and isinstance(order['completed_at'], str):
        order['completed_at'] = datetime.fromisoformat(order['completed_at'])
    
    return order

@api_router.put("/orders/{order_id}/status", response_model=Order)
async def update_order_status(order_id: str, status_update: OrderStatusUpdate):
    """Update order status"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Update status
    update_data = {"status": status_update.status}
    
    # Add timeline event if provided
    if status_update.timeline_event:
        timeline = order.get('timeline', [])
        timeline.append({
            "event": status_update.timeline_event,
            "time": datetime.now(timezone.utc).strftime("%H:%M"),
            "completed": True
        })
        update_data['timeline'] = timeline
    
    # If completed, add completion time
    if status_update.status == OrderStatus.COMPLETED:
        update_data['completed_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.orders.update_one({"id": order_id}, {"$set": update_data})
    
    # Get updated order
    updated_order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if isinstance(updated_order['created_at'], str):
        updated_order['created_at'] = datetime.fromisoformat(updated_order['created_at'])
    if updated_order.get('completed_at') and isinstance(updated_order['completed_at'], str):
        updated_order['completed_at'] = datetime.fromisoformat(updated_order['completed_at'])
    
    return updated_order

# Reviews endpoints
@api_router.post("/reviews", response_model=Review)
async def create_review(review_input: ReviewCreate):
    """Create a review for a technician"""
    # Verify order exists
    order = await db.orders.find_one({"id": review_input.order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if review already exists
    existing_review = await db.reviews.find_one({"order_id": review_input.order_id}, {"_id": 0})
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already exists for this order")
    
    review = Review(**review_input.model_dump())
    
    # Save to database
    doc = review.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    
    # Update technician rating
    await update_technician_rating(review_input.technician_id)
    
    return review

@api_router.get("/technicians/{technician_id}/reviews", response_model=List[Review])
async def get_technician_reviews(technician_id: str):
    """Get all reviews for a technician"""
    reviews = await db.reviews.find({"technician_id": technician_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Convert ISO strings back to datetime
    for review in reviews:
        if isinstance(review['created_at'], str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    
    return reviews

async def update_technician_rating(technician_id: str):
    """Recalculate technician rating based on reviews"""
    reviews = await db.reviews.find({"technician_id": technician_id}, {"_id": 0}).to_list(1000)
    
    if reviews:
        total_rating = sum(review['rating'] for review in reviews)
        avg_rating = round(total_rating / len(reviews), 1)
        
        await db.technicians.update_one(
            {"id": technician_id},
            {"$set": {"rating": avg_rating, "reviews_count": len(reviews)}}
        )


# Chat endpoints
@api_router.get("/conversations", response_model=List[Conversation])
async def get_conversations():
    """Get all conversations"""
    conversations = await db.conversations.find({}, {"_id": 0}).sort("last_message_time", -1).to_list(100)
    for c in conversations:
        if isinstance(c.get('last_message_time'), str):
            c['last_message_time'] = datetime.fromisoformat(c['last_message_time'])
        if isinstance(c.get('created_at'), str):
            c['created_at'] = datetime.fromisoformat(c['created_at'])
    return conversations

@api_router.get("/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get a specific conversation"""
    conv = await db.conversations.find_one({"id": conversation_id}, {"_id": 0})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if isinstance(conv.get('last_message_time'), str):
        conv['last_message_time'] = datetime.fromisoformat(conv['last_message_time'])
    if isinstance(conv.get('created_at'), str):
        conv['created_at'] = datetime.fromisoformat(conv['created_at'])
    # Reset unread count
    await db.conversations.update_one({"id": conversation_id}, {"$set": {"unread_count": 0}})
    return conv

@api_router.post("/conversations", response_model=Conversation)
async def start_conversation(input: ConversationStart):
    """Start a new conversation with a technician (or return existing)"""
    # Check if conversation exists
    existing = await db.conversations.find_one({"technician_id": input.technician_id}, {"_id": 0})
    if existing:
        if isinstance(existing.get('last_message_time'), str):
            existing['last_message_time'] = datetime.fromisoformat(existing['last_message_time'])
        if isinstance(existing.get('created_at'), str):
            existing['created_at'] = datetime.fromisoformat(existing['created_at'])
        return existing
    
    # Get technician
    tech = await db.technicians.find_one({"id": input.technician_id}, {"_id": 0})
    if not tech:
        raise HTTPException(status_code=404, detail="Technician not found")
    
    conv = Conversation(
        technician_id=tech['id'],
        technician_name=tech['name'],
        technician_photo=tech['photo_url'],
        technician_specialization=tech['specialization'],
        last_message=input.initial_message or "",
    )
    doc = conv.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['last_message_time'] = doc['last_message_time'].isoformat()
    await db.conversations.insert_one(doc)
    
    if input.initial_message:
        msg = Message(conversation_id=conv.id, sender='user', text=input.initial_message)
        msg_doc = msg.model_dump()
        msg_doc['created_at'] = msg_doc['created_at'].isoformat()
        await db.messages.insert_one(msg_doc)
    
    return conv

@api_router.get("/conversations/{conversation_id}/messages", response_model=List[Message])
async def get_messages(conversation_id: str):
    """Get all messages in a conversation"""
    messages = await db.messages.find({"conversation_id": conversation_id}, {"_id": 0}).sort("created_at", 1).to_list(1000)
    for m in messages:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return messages

@api_router.post("/conversations/{conversation_id}/messages", response_model=Message)
async def send_message(conversation_id: str, input: MessageCreate):
    """Send a message in a conversation"""
    conv = await db.conversations.find_one({"id": conversation_id}, {"_id": 0})
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    msg = Message(conversation_id=conversation_id, sender=input.sender, text=input.text)
    msg_doc = msg.model_dump()
    msg_doc['created_at'] = msg_doc['created_at'].isoformat()
    await db.messages.insert_one(msg_doc)
    
    # Update conversation last_message
    await db.conversations.update_one(
        {"id": conversation_id},
        {"$set": {
            "last_message": input.text,
            "last_message_time": msg_doc['created_at']
        }}
    )
    
    # Auto-reply from technician after 1 message (mock)
    auto_replies = [
        "Halo! Terima kasih sudah menghubungi saya. Ada yang bisa dibantu?",
        "Baik, saya akan segera ke lokasi Anda. Mohon ditunggu ya.",
        "Untuk masalah ini biasanya 1-2 jam pengerjaan. Apakah waktunya sesuai?",
        "Sip, saya catat. Sampai bertemu di lokasi ya pak/bu.",
    ]
    
    # Count user messages, if technician hasn't replied yet, send auto-reply
    user_msg_count = await db.messages.count_documents({"conversation_id": conversation_id, "sender": "user"})
    tech_msg_count = await db.messages.count_documents({"conversation_id": conversation_id, "sender": "technician"})
    
    if input.sender == 'user' and tech_msg_count < user_msg_count:
        reply_text = auto_replies[(tech_msg_count) % len(auto_replies)]
        reply = Message(conversation_id=conversation_id, sender='technician', text=reply_text)
        reply_doc = reply.model_dump()
        reply_doc['created_at'] = reply_doc['created_at'].isoformat()
        await db.messages.insert_one(reply_doc)
        await db.conversations.update_one(
            {"id": conversation_id},
            {"$set": {"last_message": reply_text, "last_message_time": reply_doc['created_at']}}
        )
    
    return msg


# Activities endpoint
@api_router.get("/activities")
async def get_activities():
    """Get recent activities for social proof"""
    activities = await db.activities.find({}, {"_id": 0}).sort("minutes_ago", 1).to_list(50)
    return activities


# Bantuin (Custom Help Request) Endpoints

# Mock helper data for auto-offers
MOCK_HELPERS = [
    {"id": "helper-001", "name": "Andi Helper", "photo": "https://i.pravatar.cc/150?img=11", "rating": 4.9, "reviews_count": 156, "distance": 1.2, "specialty": "Multi-task"},
    {"id": "helper-002", "name": "Rizky", "photo": "https://i.pravatar.cc/150?img=17", "rating": 4.8, "reviews_count": 98, "distance": 1.8, "specialty": "Angkut & Pindahan"},
    {"id": "helper-003", "name": "Bayu Pratama", "photo": "https://i.pravatar.cc/150?img=60", "rating": 4.7, "reviews_count": 142, "distance": 2.3, "specialty": "Helper Event"},
    {"id": "helper-004", "name": "Dimas", "photo": "https://i.pravatar.cc/150?img=65", "rating": 4.9, "reviews_count": 211, "distance": 0.8, "specialty": "Antri & Beli"},
    {"id": "helper-005", "name": "Fauzi", "photo": "https://i.pravatar.cc/150?img=59", "rating": 4.6, "reviews_count": 87, "distance": 3.0, "specialty": "Ambil Barang"},
    {"id": "helper-006", "name": "Sari", "photo": "https://i.pravatar.cc/150?img=5", "rating": 4.8, "reviews_count": 134, "distance": 1.5, "specialty": "Belanja Titipan"},
]

def generate_helper_offers(request_id: str, budget: int, count: int = 3):
    """Generate mock helper offers based on budget"""
    import random
    selected = random.sample(MOCK_HELPERS, count)
    offers = []
    for h in selected:
        # Price varies +/- 15% of budget
        variance = random.uniform(0.85, 1.1)
        price = int(budget * variance / 1000) * 1000  # Round to nearest 1000
        offer = HelperOffer(
            request_id=request_id,
            helper_id=h["id"],
            helper_name=h["name"],
            helper_photo=h["photo"],
            rating=h["rating"],
            reviews_count=h["reviews_count"],
            distance=h["distance"],
            eta_minutes=random.randint(15, 45),
            price=price,
            note=f"Spesialis {h['specialty']}. Siap bantu!"
        )
        offers.append(offer)
    return offers

@api_router.post("/bantuin", response_model=BantuinRequest)
async def create_bantuin_request(input: BantuinCreate):
    """Create a new help request with validation"""
    # Validate request
    is_valid, violation_type = validate_bantuin_request(input.title, input.detail)
    
    if not is_valid:
        if violation_type == "technical":
            raise HTTPException(
                status_code=400, 
                detail="Layanan ini tersedia di kategori utama DiBantu. Silakan pilih kategori yang sesuai agar ditangani oleh teknisi profesional."
            )
        else:  # safety
            raise HTTPException(
                status_code=400, 
                detail="Maaf, request ini belum bisa diproses melalui Bantuin karena termasuk layanan berisiko tinggi atau melibatkan keselamatan orang. Silakan pilih bantuan ringan lainnya."
            )
    
    count = await db.bantuin_requests.count_documents({})
    req_number = f"BTN-{str(count + 100001).zfill(6)}"
    
    req = BantuinRequest(
        request_number=req_number,
        title=input.title,
        detail=input.detail,
        location=input.location,
        schedule=input.schedule,
        budget=input.budget,
        photo_url=input.photo_url,
        status="searching"
    )
    
    doc = req.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bantuin_requests.insert_one(doc)
    
    # Auto-generate 3 helper offers
    offers = generate_helper_offers(req.id, input.budget, 3)
    for offer in offers:
        offer_doc = offer.model_dump()
        offer_doc['created_at'] = offer_doc['created_at'].isoformat()
        await db.helper_offers.insert_one(offer_doc)
    
    return req

@api_router.get("/bantuin", response_model=List[BantuinRequest])
async def get_bantuin_requests(status: Optional[str] = None):
    """Get all bantuin requests"""
    query = {"status": status} if status else {}
    requests = await db.bantuin_requests.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for r in requests:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
        if r.get('completed_at') and isinstance(r.get('completed_at'), str):
            r['completed_at'] = datetime.fromisoformat(r['completed_at'])
    return requests

@api_router.get("/bantuin/{request_id}", response_model=BantuinRequest)
async def get_bantuin_request(request_id: str):
    """Get a specific bantuin request"""
    req = await db.bantuin_requests.find_one({"id": request_id}, {"_id": 0})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if isinstance(req.get('created_at'), str):
        req['created_at'] = datetime.fromisoformat(req['created_at'])
    if req.get('completed_at') and isinstance(req.get('completed_at'), str):
        req['completed_at'] = datetime.fromisoformat(req['completed_at'])
    return req

@api_router.get("/bantuin/{request_id}/offers", response_model=List[HelperOffer])
async def get_bantuin_offers(request_id: str):
    """Get all helper offers for a request"""
    offers = await db.helper_offers.find({"request_id": request_id}, {"_id": 0}).to_list(50)
    for o in offers:
        if isinstance(o.get('created_at'), str):
            o['created_at'] = datetime.fromisoformat(o['created_at'])
    return offers

@api_router.put("/bantuin/{request_id}/select-helper", response_model=BantuinRequest)
async def select_helper(request_id: str, input: BantuinSelectHelper):
    """Select a helper from offers"""
    offer = await db.helper_offers.find_one({"id": input.offer_id, "request_id": request_id}, {"_id": 0})
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    await db.bantuin_requests.update_one(
        {"id": request_id},
        {"$set": {
            "selected_helper_id": offer['helper_id'],
            "selected_offer_id": offer['id'],
            "final_price": offer['price'],
            "status": "helper_selected"
        }}
    )
    
    req = await db.bantuin_requests.find_one({"id": request_id}, {"_id": 0})
    if isinstance(req.get('created_at'), str):
        req['created_at'] = datetime.fromisoformat(req['created_at'])
    return req

@api_router.put("/bantuin/{request_id}/status", response_model=BantuinRequest)
async def update_bantuin_status(request_id: str, input: BantuinStatusUpdate):
    """Update bantuin request status"""
    update_data = {"status": input.status}
    if input.status == "completed":
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()
    await db.bantuin_requests.update_one({"id": request_id}, {"$set": update_data})
    
    req = await db.bantuin_requests.find_one({"id": request_id}, {"_id": 0})
    if isinstance(req.get('created_at'), str):
        req['created_at'] = datetime.fromisoformat(req['created_at'])
    if req.get('completed_at') and isinstance(req.get('completed_at'), str):
        req['completed_at'] = datetime.fromisoformat(req['completed_at'])
    return req


# War Tiket Endpoints
@api_router.post("/bantuin/war-tiket", response_model=WarTiketRequest)
async def create_war_tiket_request(input: WarTiketCreate):
    """Create a new ticket war request"""
    count = await db.war_tiket_requests.count_documents({})
    req_number = f"TIX-{str(count + 200001).zfill(6)}"
    
    req = WarTiketRequest(
        request_number=req_number,
        event_name=input.event_name,
        platform_link=input.platform_link,
        ticket_war_datetime=input.ticket_war_datetime,
        ticket_category=input.ticket_category,
        ticket_quantity=input.ticket_quantity,
        max_price=input.max_price,
        standby_fee=input.standby_fee,
        success_fee=input.success_fee,
        notes=input.notes,
        status="waiting"
    )
    
    doc = req.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.war_tiket_requests.insert_one(doc)
    
    return req

@api_router.get("/bantuin/war-tiket", response_model=List[WarTiketRequest])
async def get_war_tiket_requests(status: Optional[str] = None):
    """Get all war tiket requests"""
    query = {"status": status} if status else {}
    requests = await db.war_tiket_requests.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for r in requests:
        if isinstance(r.get('created_at'), str):
            r['created_at'] = datetime.fromisoformat(r['created_at'])
        if r.get('completed_at') and isinstance(r.get('completed_at'), str):
            r['completed_at'] = datetime.fromisoformat(r['completed_at'])
    return requests

@api_router.get("/bantuin/war-tiket/{request_id}", response_model=WarTiketRequest)
async def get_war_tiket_request(request_id: str):
    """Get a specific war tiket request"""
    req = await db.war_tiket_requests.find_one({"id": request_id}, {"_id": 0})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if isinstance(req.get('created_at'), str):
        req['created_at'] = datetime.fromisoformat(req['created_at'])
    if req.get('completed_at') and isinstance(req.get('completed_at'), str):
        req['completed_at'] = datetime.fromisoformat(req['completed_at'])
    return req


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
