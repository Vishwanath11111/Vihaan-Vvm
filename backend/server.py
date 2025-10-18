from fastapi import FastAPI, APIRouter, HTTPException, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
from enum import Enum
import hashlib

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Vihaan Care Nest API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class PackageType(str, Enum):
    BABY = "baby"
    MOTHER = "mother"

class PlanType(str, Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"

class UserRole(str, Enum):
    CUSTOMER = "customer"
    TEAM_MEMBER = "team_member"
    ADMIN = "admin"

class VisitStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    role: UserRole
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    address: Optional[str] = None
    city: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: UserRole = UserRole.CUSTOMER
    address: Optional[str] = None
    city: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Package(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    package_type: PackageType
    plan_type: PlanType
    price: int
    visits_per_week: int
    duration_hours: str
    features: List[str]
    is_popular: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Subscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    package_id: str
    start_date: datetime
    end_date: datetime
    status: str = "active"
    payment_status: PaymentStatus = PaymentStatus.PENDING
    monthly_amount: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SubscriptionCreate(BaseModel):
    customer_id: str
    package_id: str
    start_date: datetime
    duration_months: int = 1

class Visit(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subscription_id: str
    team_member_id: str
    customer_id: str
    scheduled_date: datetime
    actual_start_time: Optional[datetime] = None
    actual_end_time: Optional[datetime] = None
    status: VisitStatus = VisitStatus.SCHEDULED
    services_provided: Optional[List[str]] = None
    notes: Optional[str] = None
    customer_rating: Optional[int] = None
    customer_review: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VisitCreate(BaseModel):
    subscription_id: str
    team_member_id: str
    customer_id: str
    scheduled_date: datetime

class VisitLog(BaseModel):
    visit_id: str
    start_time: datetime
    end_time: datetime
    services_provided: List[str]
    notes: Optional[str] = None

class VisitRating(BaseModel):
    visit_id: str
    rating: int = Field(ge=1, le=5)
    review: Optional[str] = None

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

# Routes
@api_router.get("/")
async def root():
    return {"message": "Vihaan Care Nest API", "status": "running"}

# User Management
@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({
        "$or": [
            {"email": user_data.email},
            {"phone": user_data.phone}
        ]
    })
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email or phone already exists")
    
    user_dict = user_data.dict()
    user_dict['password_hash'] = hash_password(user_dict.pop('password'))
    user_obj = User(**user_dict)
    
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.post("/users/login")
async def login_user(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email})
    
    if not user or not verify_password(login_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user['is_active']:
        raise HTTPException(status_code=401, detail="Account is deactivated")
    
    # Remove password hash and MongoDB _id from response
    user.pop('password_hash')
    user.pop('_id', None)
    return {"user": user, "message": "Login successful"}

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# Package Management
@api_router.post("/packages", response_model=Package)
async def create_package(package_data: Package):
    await db.packages.insert_one(package_data.dict())
    return package_data

@api_router.get("/packages", response_model=List[Package])
async def get_packages(package_type: Optional[PackageType] = None):
    query = {"is_active": True}
    if package_type:
        query["package_type"] = package_type
    
    packages = await db.packages.find(query).to_list(1000)
    return [Package(**pkg) for pkg in packages]

@api_router.get("/packages/{package_id}", response_model=Package)
async def get_package(package_id: str):
    package = await db.packages.find_one({"id": package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return Package(**package)

# Subscription Management
@api_router.post("/subscriptions", response_model=Subscription)
async def create_subscription(subscription_data: SubscriptionCreate):
    # Verify customer and package exist
    customer = await db.users.find_one({"id": subscription_data.customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    package = await db.packages.find_one({"id": subscription_data.package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    end_date = subscription_data.start_date + timedelta(days=30 * subscription_data.duration_months)
    
    subscription_dict = subscription_data.dict()
    subscription_dict['end_date'] = end_date
    subscription_dict['monthly_amount'] = package['price']
    
    subscription_obj = Subscription(**subscription_dict)
    await db.subscriptions.insert_one(subscription_obj.dict())
    
    return subscription_obj

@api_router.get("/subscriptions/customer/{customer_id}", response_model=List[Subscription])
async def get_customer_subscriptions(customer_id: str):
    subscriptions = await db.subscriptions.find({"customer_id": customer_id}).to_list(1000)
    return [Subscription(**sub) for sub in subscriptions]

@api_router.get("/subscriptions/{subscription_id}", response_model=Subscription)
async def get_subscription(subscription_id: str):
    subscription = await db.subscriptions.find_one({"id": subscription_id})
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return Subscription(**subscription)

# Visit Management
@api_router.post("/visits", response_model=Visit)
async def create_visit(visit_data: VisitCreate):
    visit_obj = Visit(**visit_data.dict())
    await db.visits.insert_one(visit_obj.dict())
    return visit_obj

@api_router.get("/visits/customer/{customer_id}", response_model=List[Visit])
async def get_customer_visits(customer_id: str):
    visits = await db.visits.find({"customer_id": customer_id}).to_list(1000)
    return [Visit(**visit) for visit in visits]

@api_router.get("/visits/team-member/{team_member_id}", response_model=List[Visit])
async def get_team_member_visits(team_member_id: str):
    visits = await db.visits.find({"team_member_id": team_member_id}).to_list(1000)
    return [Visit(**visit) for visit in visits]

@api_router.put("/visits/{visit_id}/log")
async def log_visit(visit_id: str, visit_log: VisitLog):
    visit = await db.visits.find_one({"id": visit_id})
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    update_data = {
        "actual_start_time": visit_log.start_time,
        "actual_end_time": visit_log.end_time,
        "services_provided": visit_log.services_provided,
        "notes": visit_log.notes,
        "status": VisitStatus.COMPLETED
    }
    
    await db.visits.update_one(
        {"id": visit_id},
        {"$set": update_data}
    )
    
    return {"message": "Visit logged successfully"}

@api_router.put("/visits/{visit_id}/rate")
async def rate_visit(visit_id: str, rating_data: VisitRating):
    visit = await db.visits.find_one({"id": visit_id})
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    update_data = {
        "customer_rating": rating_data.rating,
        "customer_review": rating_data.review
    }
    
    await db.visits.update_one(
        {"id": visit_id},
        {"$set": update_data}
    )
    
    return {"message": "Visit rated successfully"}

# Team Member Performance
@api_router.get("/team-members/{team_member_id}/performance")
async def get_team_member_performance(team_member_id: str):
    # Get all completed visits for this team member
    visits = await db.visits.find({
        "team_member_id": team_member_id,
        "status": VisitStatus.COMPLETED,
        "customer_rating": {"$exists": True}
    }).to_list(1000)
    
    if not visits:
        return {
            "team_member_id": team_member_id,
            "total_visits": 0,
            "average_rating": 0,
            "total_reviews": 0
        }
    
    total_visits = len(visits)
    ratings = [visit['customer_rating'] for visit in visits if visit.get('customer_rating')]
    reviews = [visit for visit in visits if visit.get('customer_review')]
    
    average_rating = sum(ratings) / len(ratings) if ratings else 0
    
    return {
        "team_member_id": team_member_id,
        "total_visits": total_visits,
        "average_rating": round(average_rating, 2),
        "total_reviews": len(reviews),
        "recent_reviews": [{
            "rating": visit['customer_rating'],
            "review": visit['customer_review'],
            "date": visit['created_at']
        } for visit in reviews[-5:]]
    }

# Admin Dashboard Data
@api_router.get("/admin/dashboard")
async def get_dashboard_data():
    # Get counts
    total_customers = await db.users.count_documents({"role": UserRole.CUSTOMER})
    total_team_members = await db.users.count_documents({"role": UserRole.TEAM_MEMBER})
    active_subscriptions = await db.subscriptions.count_documents({"status": "active"})
    total_visits = await db.visits.count_documents({})
    
    # Get recent activities and remove MongoDB _id fields
    recent_subscriptions = await db.subscriptions.find({}).sort("created_at", -1).limit(5).to_list(5)
    recent_visits = await db.visits.find({}).sort("created_at", -1).limit(10).to_list(10)
    
    # Remove _id fields from recent data
    for sub in recent_subscriptions:
        sub.pop('_id', None)
    for visit in recent_visits:
        visit.pop('_id', None)
    
    return {
        "total_customers": total_customers,
        "total_team_members": total_team_members,
        "active_subscriptions": active_subscriptions,
        "total_visits": total_visits,
        "recent_subscriptions": recent_subscriptions,
        "recent_visits": recent_visits
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
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