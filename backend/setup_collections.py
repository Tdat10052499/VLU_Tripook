#!/usr/bin/env python3
"""
MongoDB Collections Setup Script
Tạo collections và sample data cho Tripook Provider system
"""

import os
import sys
from datetime import datetime, timedelta
from bson import ObjectId

# Thêm path để import modules
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.utils.database import get_db, init_db
from app.models.user import User
from app.models.service import Service
from app.models.booking import Booking
from flask import Flask

def create_sample_users():
    """Tạo sample users (bao gồm cả providers)"""
    print("🔄 Creating sample users...")
    
    users_data = [
        {
            "email": "admin@tripook.com",
            "name": "Admin Tripook",
            "role": "admin",
            "password": "admin123"
        },
        {
            "email": "customer@gmail.com", 
            "name": "Nguyễn Văn A",
            "role": "user",
            "password": "customer123"
        },
        {
            "email": "provider.hotel@gmail.com",
            "name": "Khách sạn Mường Thanh",
            "role": "provider",
            "password": "provider123",
            "provider_info": {
                "company_name": "Khách sạn Mường Thanh Luxury Nha Trang",
                "business_type": "hotel",
                "description": "Khách sạn 5 sao sang trọng với view biển tuyệt đẹp",
                "address": "60 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
                "business_phone": "0258 3828 282",
                "business_email": "info@muongthanhnhatrang.com",
                "website": "https://muongthanh.com",
                "bank_account": {
                    "account_number": "0123456789",
                    "bank_name": "Vietcombank",
                    "account_holder": "Công ty TNHH Khách sạn Mường Thanh"
                },
                "approved_at": datetime.utcnow(),
                "is_active": True
            }
        },
        {
            "email": "provider.tour@gmail.com",
            "name": "Saigon Tourist",
            "role": "provider", 
            "password": "provider123",
            "provider_info": {
                "company_name": "Công ty Du lịch Saigon Tourist",
                "business_type": "tour",
                "description": "Công ty lữ hành hàng đầu Việt Nam với hơn 30 năm kinh nghiệm",
                "address": "45 Lê Thánh Tôn, Quận 1, TP.HCM",
                "business_phone": "028 3829 8914",
                "business_email": "info@saigontourist.net",
                "website": "https://saigontourist.net",
                "bank_account": {
                    "account_number": "9876543210",
                    "bank_name": "VietinBank", 
                    "account_holder": "Công ty Du lịch Saigon Tourist"
                },
                "approved_at": datetime.utcnow(),
                "is_active": True
            }
        },
        {
            "email": "provider.transport@gmail.com",
            "name": "Vietnam Airlines",
            "role": "provider",
            "password": "provider123", 
            "provider_info": {
                "company_name": "Hãng Hàng không Quốc gia Việt Nam",
                "business_type": "transport",
                "description": "Hãng hàng không hàng đầu Việt Nam",
                "address": "Giảng Võ, Ba Đình, Hà Nội",
                "business_phone": "19001100",
                "business_email": "info@vietnamairlines.com",
                "website": "https://vietnamairlines.com",
                "bank_account": {
                    "account_number": "1122334455",
                    "bank_name": "BIDV",
                    "account_holder": "Tổng Công ty Hàng không Việt Nam"
                },
                "approved_at": datetime.utcnow(),
                "is_active": True
            }
        }
    ]
    
    created_users = []
    for user_data in users_data:
        # Tạo user object
        user = User(
            email=user_data["email"],
            name=user_data["name"],
            password=user_data["password"]
        )
        user.role = user_data["role"]
        
        # Thêm provider info nếu có
        if "provider_info" in user_data:
            user.provider_info = user_data["provider_info"]
            
        # Lưu user
        if user.save():
            created_users.append(user)
            print(f"✅ Created user: {user.email} ({user.role})")
        else:
            print(f"❌ Failed to create user: {user.email}")
    
    return created_users

def create_sample_services(users):
    """Tạo sample services từ providers"""
    print("🔄 Creating sample services...")
    
    # Tìm providers
    providers = [user for user in users if user.role == "provider"]
    
    services_data = [
        # Hotel services
        {
            "name": "Khách sạn Mường Thanh Luxury Nha Trang",
            "service_type": "accommodation",
            "provider_email": "provider.hotel@gmail.com",
            "description": "Khách sạn 5 sao sang trọng với thiết kế hiện đại, view biển tuyệt đẹp và dịch vụ đẳng cấp quốc tế.",
            "category": "hotel",
            "location": {
                "address": "60 Trần Phú, Lộc Thọ, Nha Trang, Khánh Hòa",
                "city": "Nha Trang",
                "country": "Vietnam",
                "coordinates": {"latitude": 12.2431, "longitude": 109.1943}
            },
            "pricing": {
                "base_price": 2500000,
                "currency": "VND",
                "price_type": "per_night"
            },
            "images": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"
            ],
            "features": ["WiFi miễn phí", "Hồ bơi", "Spa", "Nhà hàng", "Phòng gym", "View biển"],
            "contact": {
                "phone": "0258 3828 282",
                "email": "info@muongthanhnhatrang.com"
            }
        },
        
        # Tour services
        {
            "name": "Tour Hạ Long - Sapa 4N3Đ",
            "service_type": "tour",
            "provider_email": "provider.tour@gmail.com", 
            "description": "Khám phá vẻ đẹp kỳ vĩ của Vịnh Hạ Long và núi rừng Sapa trong 4 ngày 3 đêm đầy trải nghiệm.",
            "category": "sightseeing",
            "location": {
                "address": "Hạ Long, Quảng Ninh và Sapa, Lào Cai",
                "city": "Hạ Long",
                "country": "Vietnam", 
                "coordinates": {"latitude": 20.9101, "longitude": 107.1839}
            },
            "pricing": {
                "base_price": 5990000,
                "currency": "VND",
                "price_type": "per_person"
            },
            "images": [
                "https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?w=800",
                "https://images.unsplash.com/photo-1586798271252-e2abca2ec247?w=800"
            ],
            "features": ["Hướng dẫn viên", "Xe du lịch", "Khách sạn 3 sao", "Ăn theo chương trình", "Vé tham quan"],
            "contact": {
                "phone": "028 3829 8914",
                "email": "info@saigontourist.net"
            }
        },
        
        # Transport services
        {
            "name": "Vé máy bay Hà Nội - TP.HCM",
            "service_type": "transportation",
            "provider_email": "provider.transport@gmail.com",
            "description": "Chuyến bay thuận tiện từ Hà Nội đến TP.HCM với dịch vụ chuyên nghiệp và an toàn.",
            "category": "flight", 
            "location": {
                "address": "Sân bay Nội Bài - Sân bay Tân Sơn Nhất",
                "city": "Hà Nội",
                "country": "Vietnam",
                "coordinates": {"latitude": 21.2187, "longitude": 105.8045}
            },
            "pricing": {
                "base_price": 1200000,
                "currency": "VND", 
                "price_type": "per_ticket"
            },
            "images": [
                "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800"
            ],
            "features": ["Hành lý ký gửi", "Suất ăn", "Giải trí trên máy bay", "WiFi"],
            "contact": {
                "phone": "19001100",
                "email": "info@vietnamairlines.com"
            }
        }
    ]
    
    created_services = []
    for service_data in services_data:
        # Tìm provider by email
        provider = next((u for u in providers if u.email == service_data["provider_email"]), None)
        if not provider:
            print(f"❌ Provider not found for: {service_data['provider_email']}")
            continue
            
        # Tạo service object
        service = Service(
            name=service_data["name"],
            service_type=service_data["service_type"], 
            provider_id=provider._id
        )
        
        # Cập nhật thông tin
        service.description = service_data["description"]
        service.category = service_data["category"]
        service.location = service_data["location"]
        service.pricing = service_data["pricing"]
        service.images = service_data["images"]
        service.features = service_data["features"]
        service.contact = service_data["contact"]
        service.status = "active"
        service.verified = True
        
        # Lưu service
        if service.save():
            created_services.append(service)
            print(f"✅ Created service: {service.name}")
        else:
            print(f"❌ Failed to create service: {service.name}")
    
    return created_services

def create_sample_bookings(users, services):
    """Tạo sample bookings"""
    print("🔄 Creating sample bookings...")
    
    # Tìm customer
    customer = next((u for u in users if u.role == "user"), None)
    if not customer:
        print("❌ No customer found")
        return []
    
    created_bookings = []
    for i, service in enumerate(services[:2]):  # Chỉ tạo 2 booking
        booking = Booking(
            user_id=customer._id,
            service_id=service._id,
            trip_id=None,
            booking_type="service"
        )
        
        # Cập nhật thông tin booking
        booking.start_date = datetime.utcnow() + timedelta(days=30 + i*10)
        booking.end_date = booking.start_date + timedelta(days=2)
        booking.number_of_guests = 2
        booking.total_amount = service.pricing["base_price"] * 2
        booking.currency = service.pricing["currency"]
        booking.status = "confirmed" if i == 0 else "pending"
        booking.payment_status = "paid" if i == 0 else "pending"
        
        # Guest details
        booking.guest_details = [
            {"name": "Nguyễn Văn A", "age": 30, "id_number": "123456789"},
            {"name": "Trần Thị B", "age": 28, "id_number": "987654321"}
        ]
        
        if booking.save():
            created_bookings.append(booking)
            print(f"✅ Created booking: {booking._id}")
        else:
            print(f"❌ Failed to create booking")
    
    return created_bookings

def setup_collections():
    """Setup tất cả collections"""
    try:
        print("🚀 Starting MongoDB Collections Setup...")
        print("=" * 50)
        
        # Tạo Flask app context
        app = Flask(__name__)
        app.config['SECRET_KEY'] = 'test-key'
        app.config['MONGO_URI'] = None
        
        with app.app_context():
            # Initialize database
            init_db(app)
            db = get_db()
            
            print(f"📊 Connected to database: {db.name}")
            print(f"📋 Existing collections: {db.list_collection_names()}")
            print()
            
            # Tạo sample data
            users = create_sample_users()
            print()
            
            services = create_sample_services(users) 
            print()
            
            bookings = create_sample_bookings(users, services)
            print()
            
            # Hiển thị kết quả
            print("=" * 50)
            print("✅ SETUP COMPLETED!")
            print(f"👥 Users created: {len(users)}")
            print(f"🏨 Services created: {len(services)}")
            print(f"📋 Bookings created: {len(bookings)}")
            print()
            
            print("📋 Collections in database:")
            for collection_name in db.list_collection_names():
                count = db[collection_name].count_documents({})
                print(f"  - {collection_name}: {count} documents")
            
            print()
            print("🎉 You can now use MongoDB Compass to view the data!")
            print("🔗 Connection string: mongodb://localhost:27017/tripook")
            
    except Exception as e:
        print(f"❌ Error during setup: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    setup_collections()