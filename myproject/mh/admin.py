from django.contrib import admin
from .models import *
from rest_framework.authtoken.models import Token

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'account_type', 'is_verified', 'is_banned')
    list_filter = ('account_type', 'is_verified', 'is_banned')
    search_fields = ('username', 'email', 'first_name', 'last_name')

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'listing_type', 'price', 'is_active', 'created_at')
    list_filter = ('listing_type', 'is_active', 'category')
    search_fields = ('title', 'description')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'is_service')
    list_filter = ('is_service',)
    search_fields = ('name',)

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'state', 'country')
    list_filter = ('country', 'state')
    search_fields = ('name', 'state', 'country')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer', 'reviewee', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('reviewer__username', 'reviewee__username')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('customer', 'service_provider', 'status', 'total_price', 'created_at')
    list_filter = ('status',)
    search_fields = ('customer__username', 'service_provider__username')

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('reporter', 'reported_object_type', 'reason', 'status', 'created_at')
    list_filter = ('reported_object_type', 'reason', 'status')
    search_fields = ('reporter__username',)

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duration', 'is_active')
    list_filter = ('duration', 'is_active')

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ('title', 'customer', 'category', 'status', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'customer__username')

# Register other models
admin.site.register(ListingImage)
admin.site.register(Message)
admin.site.register(Conversation)
admin.site.register(Favorite)
admin.site.register(PaymentTransaction)
admin.site.register(UserSubscription)
admin.site.register(Notification)
admin.site.register(NotificationPreference)
admin.site.register(ServiceArea)
admin.site.register(WishlistItem)
admin.site.register(Certification)
admin.site.register(PortfolioItem)
admin.site.register(Language)
admin.site.register(Tag)
admin.site.register(Token)
