import os
import django
from django.core.files import File
from io import BytesIO
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from mh.models import *
from django.contrib.auth.hashers import make_password

def create_categories():
    print("Creating categories...")
    
    categories_data = [
        # Handyman Services
        {'name': 'Plumbing', 'is_service': True, 'icon': 'fa-faucet'},
        {'name': 'Electrical', 'is_service': True, 'icon': 'fa-bolt'},
        {'name': 'Carpentry', 'is_service': True, 'icon': 'fa-hammer'},
        {'name': 'Painting', 'is_service': True, 'icon': 'fa-paint-roller'},
        {'name': 'Cleaning', 'is_service': True, 'icon': 'fa-broom'},
        {'name': 'Gardening', 'is_service': True, 'icon': 'fa-leaf'},
        {'name': 'Moving', 'is_service': True, 'icon': 'fa-truck-moving'},
        
        # Secondhand Items
        {'name': 'Electronics', 'is_service': False, 'icon': 'fa-laptop'},
        {'name': 'Furniture', 'is_service': False, 'icon': 'fa-couch'},
        {'name': 'Clothing', 'is_service': False, 'icon': 'fa-tshirt'},
        {'name': 'Tools', 'is_service': False, 'icon': 'fa-tools'},
        {'name': 'Sports', 'is_service': False, 'icon': 'fa-basketball-ball'},
        {'name': 'Books', 'is_service': False, 'icon': 'fa-book'},
    ]
    
    for cat_data in categories_data:
        Category.objects.get_or_create(
            name=cat_data['name'],
            defaults={
                'slug': cat_data['name'].lower().replace(' ', '-'),
                'is_service': cat_data['is_service'],
                'icon': cat_data['icon']
            }
        )
    print(f"Created {len(categories_data)} categories")

def create_locations():
    print("Creating locations...")
    
    locations_data = [
        {'name': 'Lagos Mainland', 'state': 'Lagos', 'country': 'Nigeria'},
        {'name': 'Lagos Island', 'state': 'Lagos', 'country': 'Nigeria'},
        {'name': 'Abuja Central', 'state': 'Abuja', 'country': 'Nigeria'},
        {'name': 'Gwarinpa', 'state': 'Abuja', 'country': 'Nigeria'},
        {'name': 'Ikeja', 'state': 'Lagos', 'country': 'Nigeria'},
        {'name': 'Victoria Island', 'state': 'Lagos', 'country': 'Nigeria'},
        {'name': 'Lekki', 'state': 'Lagos', 'country': 'Nigeria'},
    ]
    
    for loc_data in locations_data:
        Location.objects.get_or_create(
            name=loc_data['name'],
            state=loc_data['state'],
            defaults={'country': loc_data['country']}
        )
    print(f"Created {len(locations_data)} locations")

def create_users():
    print("Creating users...")
    
    users_data = [
        {
            'username': 'john_handyman',
            'email': 'john@example.com',
            'password': 'password123',
            'account_type': 'service_provider',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '+2348012345678',
            'hourly_rate': 25.00,
            'skills': ['Plumbing', 'Electrical'],
            'bio': 'Experienced handyman with 5+ years in plumbing and electrical work.'
        },
        {
            'username': 'sarah_cleaner',
            'email': 'sarah@example.com',
            'password': 'password123',
            'account_type': 'service_provider',
            'first_name': 'Sarah',
            'last_name': 'Smith',
            'phone_number': '+2348023456789',
            'hourly_rate': 20.00,
            'skills': ['Cleaning'],
            'bio': 'Professional cleaner with attention to detail.'
        },
        {
            'username': 'mike_electrician',
            'email': 'mike@example.com',
            'password': 'password123',
            'account_type': 'service_provider',
            'first_name': 'Mike',
            'last_name': 'Johnson',
            'phone_number': '+2348034567890',
            'hourly_rate': 30.00,
            'skills': ['Electrical'],
            'bio': 'Certified electrician with 8 years experience.'
        },
        {
            'username': 'buyer_jane',
            'email': 'jane@example.com',
            'password': 'password123',
            'account_type': 'buyer',
            'first_name': 'Jane',
            'last_name': 'Wilson',
            'phone_number': '+2348045678901',
            'bio': 'Looking for reliable handyman services.'
        },
        {
            'username': 'seller_tom',
            'email': 'tom@example.com',
            'password': 'password123',
            'account_type': 'seller',
            'first_name': 'Tom',
            'last_name': 'Brown',
            'phone_number': '+2348056789012',
            'bio': 'Selling quality secondhand items.'
        }
    ]
    
    for user_data in users_data:
        user, created = User.objects.get_or_create(
            username=user_data['username'],
            defaults={
                'email': user_data['email'],
                'password': make_password(user_data['password']),
                'account_type': user_data['account_type'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'phone_number': user_data['phone_number'],
                'hourly_rate': user_data.get('hourly_rate'),
                'bio': user_data['bio'],
                'is_verified': True
            }
        )
        
        if created and 'skills' in user_data:
            for skill_name in user_data['skills']:
                try:
                    category = Category.objects.get(name=skill_name)
                    user.skills.add(category)
                except Category.DoesNotExist:
                    pass
    
    print(f"Created {len(users_data)} users")

def create_listings():
    print("Creating listings...")
    
    users = User.objects.all()
    categories = Category.objects.all()
    locations = Location.objects.all()
    
    service_listings = [
        {
            'title': 'Professional Plumbing Services',
            'description': 'Expert plumbing solutions for homes and offices. Fix leaks, installations, and more.',
            'price': 45.00,
            'listing_type': 'service',
            'duration': '2-4 hours'
        },
        {
            'title': 'Electrical Wiring & Repairs',
            'description': 'Certified electrician for all your electrical needs. Safe and reliable service.',
            'price': 60.00,
            'listing_type': 'service',
            'duration': '3-5 hours'
        },
        {
            'title': 'Deep Cleaning Service',
            'description': 'Thorough cleaning for homes and offices. We pay attention to every detail.',
            'price': 35.00,
            'listing_type': 'service',
            'duration': '4-6 hours'
        }
    ]
    
    product_listings = [
        {
            'title': 'Gently Used Office Chair',
            'description': 'Comfortable office chair in excellent condition. Perfect for home office.',
            'price': 75.00,
            'listing_type': 'product',
            'condition': 'used_good'
        },
        {
            'title': 'Samsung Galaxy S10',
            'description': 'Well-maintained phone with original accessories. Battery health 85%.',
            'price': 250.00,
            'listing_type': 'product',
            'condition': 'used_good'
        },
        {
            'title': 'Wooden Dining Table',
            'description': 'Beautiful wooden table that seats 6 people. Minor scratches but sturdy.',
            'price': 120.00,
            'listing_type': 'product',
            'condition': 'used_fair'
        }
    ]
    
    # Create service listings
    for listing_data in service_listings:
        listing = Listing.objects.create(
            title=listing_data['title'],
            description=listing_data['description'],
            price=listing_data['price'],
            listing_type=listing_data['listing_type'],
            duration=listing_data['duration'],
            user=random.choice(users.filter(account_type='service_provider')),
            category=random.choice(categories.filter(is_service=True)),
            location=random.choice(locations),
            condition='new'
        )
    
    # Create product listings
    for listing_data in product_listings:
        listing = Listing.objects.create(
            title=listing_data['title'],
            description=listing_data['description'],
            price=listing_data['price'],
            listing_type=listing_data['listing_type'],
            condition=listing_data['condition'],
            user=random.choice(users.filter(account_type='seller')),
            category=random.choice(categories.filter(is_service=False)),
            location=random.choice(locations)
        )
    
    print(f"Created {len(service_listings) + len(product_listings)} listings")

def create_reviews():
    print("Creating reviews...")
    
    users = User.objects.filter(account_type='buyer')
    service_providers = User.objects.filter(account_type='service_provider')
    listings = Listing.objects.filter(listing_type='service')
    
    reviews = [
        {'rating': 5, 'comment': 'Excellent service! John fixed my leak quickly and professionally.'},
        {'rating': 4, 'comment': 'Good work, but was 30 minutes late to the appointment.'},
        {'rating': 5, 'comment': 'Sarah cleaned my apartment perfectly. Will hire again!'},
        {'rating': 3, 'comment': 'Average service. The job was done but took longer than expected.'},
        {'rating': 5, 'comment': 'Mike is an amazing electrician. Highly recommended!'},
    ]
    
    for review_data in reviews:
        Review.objects.create(
            rating=review_data['rating'],
            comment=review_data['comment'],
            reviewer=random.choice(users),
            reviewee=random.choice(service_providers),
            listing=random.choice(listings) if random.choice([True, False]) else None
        )
    
    print(f"Created {len(reviews)} reviews")

def main():
    print("Starting database seeding...")
    
    # Clear existing data (optional - be careful!)
    # Category.objects.all().delete()
    # Location.objects.all().delete()
    # User.objects.all().delete()
    
    create_categories()
    create_locations()
    create_users()
    create_listings()
    create_reviews()
    
    print("Database seeding completed successfully! 🎉")
    print("\nSample login credentials:")
    print("Service Provider: john_handyman / password123")
    print("Buyer: buyer_jane / password123")
    print("Seller: seller_tom / password123")

if __name__ == '__main__':
    main()