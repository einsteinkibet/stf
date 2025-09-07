from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'listings', views.ListingViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'locations', views.LocationViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'conversations', views.ConversationViewSet)
router.register(r'favorites', views.FavoriteViewSet, basename='favorite')
router.register(r'payments', views.PaymentTransactionViewSet)
router.register(r'subscriptions/plans', views.SubscriptionPlanViewSet)
router.register(r'subscriptions', views.UserSubscriptionViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'service-requests', views.ServiceRequestViewSet)
router.register(r'reports', views.ReportViewSet)

urlpatterns = [
    # Auth endpoints
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    path('auth/password-reset/', views.PasswordResetView.as_view(), name='password-reset'),
    path('auth/password-reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Include router URLs
    path('', include(router.urls)),
    
    # Additional endpoints
    path('listings/<uuid:id>/favorite/', views.FavoriteListingView.as_view(), name='favorite-listing'),
    path('listings/<uuid:id>/images/', views.ListingImageView.as_view(), name='listing-images'),
    path('listings/favorites/', views.UserFavoritesView.as_view(), name='user-favorites'),
    
    path('bookings/customer/', views.CustomerBookingsView.as_view(), name='customer-bookings'),
    path('bookings/provider/', views.ProviderBookingsView.as_view(), name='provider-bookings'),
    path('bookings/<uuid:id>/cancel/', views.CancelBookingView.as_view(), name='cancel-booking'),
    path('bookings/<uuid:id>/confirm/', views.ConfirmBookingView.as_view(), name='confirm-booking'),
    path('bookings/<uuid:id>/complete/', views.CompleteBookingView.as_view(), name='complete-booking'),
    
    path('conversations/<uuid:id>/messages/', views.ConversationMessagesView.as_view(), name='conversation-messages'),
    path('conversations/<uuid:id>/read/', views.MarkConversationReadView.as_view(), name='mark-conversation-read'),
    
    path('notifications/read-all/', views.MarkAllNotificationsReadView.as_view(), name='mark-all-notifications-read'),
    path('notifications/unread-count/', views.UnreadNotificationsCountView.as_view(), name='unread-notifications-count'),
    
    path('analytics/events/', views.AnalyticsEventView.as_view(), name='analytics-events'),
    path('analytics/stats/', views.AnalyticsStatsView.as_view(), name='analytics-stats'),
    
    path('service-requests/<uuid:id>/close/', views.CloseServiceRequestView.as_view(), name='close-service-request'),
    path('service-requests/<uuid:id>/assign/', views.AssignServiceRequestView.as_view(), name='assign-service-request'),
    
    path('reports/<uuid:id>/resolve/', views.ResolveReportView.as_view(), name='resolve-report'),
    path('reports/<uuid:id>/dismiss/', views.DismissReportView.as_view(), name='dismiss-report'),
]