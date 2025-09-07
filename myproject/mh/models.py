from django.db import models

# Create your models here.
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.contrib.gis.db import models as gis_models
from django.contrib.gis.geos import Point
from django.contrib.postgres.indexes import GistIndex
from django.contrib.postgres.search import SearchVectorField
from django.contrib.postgres.indexes import GinIndex
import uuid

class User(AbstractUser):
    ACCOUNT_TYPES = (
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
        ('service_provider', 'Service Provider'),
        ('admin', 'Admin'),
    )
    
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES, default='buyer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, blank=True, null=True)
    geo_location = gis_models.PointField(blank=True, null=True, srid=4326)  # For spatial queries
    is_verified = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    social_links = models.JSONField(default=dict, blank=True)
    
    # For service providers
    skills = models.ManyToManyField('Category', blank=True, related_name='service_providers')
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    availability = models.CharField(max_length=100, blank=True, null=True)
    experience_years = models.PositiveIntegerField(default=0)
    certifications = models.ManyToManyField('Certification', blank=True)
    portfolio = models.ManyToManyField('PortfolioItem', blank=True)
    response_time = models.CharField(max_length=50, blank=True, null=True)  # e.g., "within 1 hour"
    languages = models.ManyToManyField('Language', blank=True)
    
    # Ratings
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.PositiveIntegerField(default=0)
    
    # Search optimization
    search_vector = SearchVectorField(null=True, blank=True)
    
    class Meta:
        indexes = [
            GinIndex(fields=['search_vector']),
            GistIndex(fields=['geo_location']),
        ]
    
    def __str__(self):
        return f"{self.username} ({self.get_account_type_display()})"

class Language(models.Model):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=10)
    
    def __str__(self):
        return self.name

class Certification(models.Model):
    name = models.CharField(max_length=200)
    issuing_organization = models.CharField(max_length=200)
    issue_date = models.DateField(blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=100, blank=True, null=True)
    credential_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.issuing_organization})"

class PortfolioItem(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    before_image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    after_image = models.ImageField(upload_to='portfolio/', blank=True, null=True)
    project_date = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    tags = models.ManyToManyField('Tag', blank=True)
    
    def __str__(self):
        return self.title

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True, related_name='subcategories')
    icon = models.CharField(max_length=50, blank=True, null=True)
    is_service = models.BooleanField(default=False)  # Whether this category is for services
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Location(models.Model):
    name = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, default="Nigeria")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        if self.state:
            return f"{self.name}, {self.state}"
        return self.name

class Listing(models.Model):
    LISTING_TYPES = (
        ('product', 'Product'),
        ('service', 'Service'),
    )
    
    CONDITION_CHOICES = (
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('used_good', 'Used - Good'),
        ('used_fair', 'Used - Fair'),
        ('used_poor', 'Used - Poor'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    geo_location = gis_models.PointField(blank=True, null=True, srid=4326)
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)
    tags = models.ManyToManyField('Tag', blank=True)
    
    # For services
    duration = models.CharField(max_length=50, blank=True, null=True)
    is_remote = models.BooleanField(default=False, blank=True)
    
    # For products
    brand = models.CharField(max_length=100, blank=True, null=True)
    model = models.CharField(max_length=100, blank=True, null=True)
    
    # Search optimization
    search_vector = SearchVectorField(null=True, blank=True)
    
    class Meta:
        indexes = [
            GinIndex(fields=['search_vector']),
            GistIndex(fields=['geo_location']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.user.username}"

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='listing_images/')
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.listing.title}"

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    is_trending = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Review(models.Model):
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_received')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('reviewer', 'reviewee', 'listing')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.rating} stars by {self.reviewer.username} for {self.reviewee.username}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings_made')
    service_provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings_received')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Booking #{str(self.id)[:8]} - {self.listing.title}"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['sent_at']
    
    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}"

class Conversation(models.Model):
    participants = models.ManyToManyField(User, related_name='conversations')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Conversation {self.id} - {', '.join([user.username for user in self.participants.all()])}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'listing')
    
    def __str__(self):
        return f"{self.user.username} favorites {self.listing.title}"

class SubscriptionPlan(models.Model):
    DURATION_CHOICES = (
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    features = models.JSONField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    max_listings = models.PositiveIntegerField(default=5)
    can_promote = models.BooleanField(default=False)
    verification_badge = models.BooleanField(default=False)
    analytics_access = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class UserSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    auto_renew = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"

class PaymentTransaction(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    PAYMENT_TYPES = (
        ('listing_promotion', 'Listing Promotion'),
        ('subscription', 'Subscription'),
        ('booking', 'Booking'),
        ('product', 'Product Purchase'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    listing = models.ForeignKey(Listing, on_delete=models.SET_NULL, null=True, blank=True)
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    subscription = models.ForeignKey(UserSubscription, on_delete=models.SET_NULL, null=True, blank=True)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='NGN')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_gateway = models.CharField(max_length=50)
    reference_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.reference_id} - {self.amount} {self.currency}"

class PromotionPackage(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration_days = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    features = models.JSONField()
    is_active = models.BooleanField(default=True)
    priority = models.PositiveIntegerField(default=1)  # Higher number = higher priority in search
    
    def __str__(self):
        return self.name

class PromotedListing(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='promotions')
    package = models.ForeignKey(PromotionPackage, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    payment = models.ForeignKey(PaymentTransaction, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Promoted: {self.listing.title}"

class Notification(models.Model):
    TYPES = (
        ('message', 'New Message'),
        ('booking', 'Booking Update'),
        ('review', 'New Review'),
        ('promotion', 'Promotion Status'),
        ('system', 'System Notification'),
        ('match', 'Service Match'),
        ('ad', 'Advertisement'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification_type} notification for {self.user.username}"

class AnalyticsEvent(models.Model):
    EVENT_TYPES = (
        ('view_listing', 'View Listing'),
        ('click_contact', 'Click Contact'),
        ('search', 'Search'),
        ('filter', 'Filter'),
        ('view_profile', 'View Profile'),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    listing = models.ForeignKey(Listing, on_delete=models.SET_NULL, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)
    search_query = models.CharField(max_length=255, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.event_type} at {self.timestamp}"

class AdCampaign(models.Model):
    TARGET_TYPES = (
        ('category', 'Category'),
        ('location', 'Location'),
        ('demographic', 'Demographic'),
        ('behavioral', 'Behavioral'),
    )
    
    name = models.CharField(max_length=200)
    advertiser = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ad_campaigns')
    target_type = models.CharField(max_length=20, choices=TARGET_TYPES)
    target_categories = models.ManyToManyField(Category, blank=True)
    target_locations = models.ManyToManyField(Location, blank=True)
    target_min_age = models.PositiveIntegerField(blank=True, null=True)
    target_max_age = models.PositiveIntegerField(blank=True, null=True)
    target_gender = models.CharField(max_length=10, blank=True, null=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class AdCreative(models.Model):
    campaign = models.ForeignKey(AdCampaign, on_delete=models.CASCADE, related_name='creatives')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='ads/')
    call_to_action = models.CharField(max_length=50, default="Learn More")
    destination_url = models.URLField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Ad for {self.campaign.name}"

class AdImpression(models.Model):
    ad = models.ForeignKey(AdCreative, on_delete=models.CASCADE, related_name='impressions')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=4, default=0)  # Cost per impression
    
    def __str__(self):
        return f"Impression for {self.ad} at {self.timestamp}"

class AdClick(models.Model):
    impression = models.ForeignKey(AdImpression, on_delete=models.CASCADE, related_name='clicks')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    cost = models.DecimalField(max_digits=10, decimal_places=4, default=0)  # Cost per click
    
    def __str__(self):
        return f"Click on {self.impression.ad} at {self.timestamp}"

class ServiceRequest(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_requests')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    geo_location = gis_models.PointField(blank=True, null=True, srid=4326)
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    urgency = models.CharField(max_length=20, choices=(
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ), default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        indexes = [
            GistIndex(fields=['geo_location']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Service Request: {self.title}"

class ServiceProposal(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='proposals')
    service_provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='proposals')
    message = models.TextField()
    proposed_price = models.DecimalField(max_digits=10, decimal_places=2)
    timeline = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('service_request', 'service_provider')
    
    def __str__(self):
        return f"Proposal for {self.service_request.title} by {self.service_provider.username}"

class MatchPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='match_preferences')
    categories = models.ManyToManyField(Category, blank=True)
    max_distance = models.PositiveIntegerField(default=50)  # in kilometers
    min_rating = models.DecimalField(max_digits=3, decimal_places=2, default=3.0)
    min_reviews = models.PositiveIntegerField(default=0)
    max_hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    notify_matches = models.BooleanField(default=True)
    notify_frequency = models.CharField(max_length=20, choices=(
        ('immediately', 'Immediately'),
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
    ), default='immediately')
    
    def __str__(self):
        return f"Match preferences for {self.user.username}"

class ServiceMatch(models.Model):
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='matches')
    service_provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='matches')
    score = models.DecimalField(max_digits=5, decimal_places=2)  # Match score from 0-100
    reason = models.TextField(blank=True, null=True)  # Why this match was made
    notified_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('service_request', 'service_provider')
    
    def __str__(self):
        return f"Match for {self.service_request.title} with {self.service_provider.username} (Score: {self.score})"


class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'listing')

class Report(models.Model):
    REPORT_TYPES = (
        ('listing', 'Listing'),
        ('user', 'User'),
        ('message', 'Message'),
        ('review', 'Review'),
    )
    
    REPORT_REASONS = (
        ('spam', 'Spam'),
        ('inappropriate', 'Inappropriate Content'),
        ('fraud', 'Fraud'),
        ('fake', 'Fake Listing'),
        ('other', 'Other'),
    )
    
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')
    reported_object_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    reported_object_id = models.UUIDField()
    reason = models.CharField(max_length=20, choices=REPORT_REASONS)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('dismissed', 'Dismissed'),
    ), default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    email_messages = models.BooleanField(default=True)
    email_bookings = models.BooleanField(default=True)
    email_reviews = models.BooleanField(default=True)
    email_promotions = models.BooleanField(default=True)
    email_newsletter = models.BooleanField(default=True)
    push_messages = models.BooleanField(default=True)
    push_bookings = models.BooleanField(default=True)
    
class ServiceArea(models.Model):
    service_provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_areas')
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    radius_km = models.PositiveIntegerField(default=10)  # Service radius in kilometers
    
    class Meta:
        unique_together = ('service_provider', 'location')