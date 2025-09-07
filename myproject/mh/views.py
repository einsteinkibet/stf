from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.db.models import Q, Count, Avg
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
# from knox.models import AuthToken
# from knox.views import LoginView as KnoxLoginView
from .models import *
from .serializers import *
from .permissions import *
from rest_framework.authtoken.models import Token

# Auth Views
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Get or create token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        })
        
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create token for the new user
            token = Token.objects.create(user=user)
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        # Delete the token
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

class ProfileView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        # Implement password reset logic
        return Response({"detail": "Password reset email sent."})

class PasswordResetConfirmView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        # Implement password reset confirmation logic
        return Response({"detail": "Password reset successful."})

# Model ViewSets
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering_fields = ['created_at', 'username']

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        user = self.get_object()
        user.is_verified = True
        user.save()
        return Response({'status': 'user verified'})

    @action(detail=True, methods=['post'])
    def ban(self, request, pk=None):
        user = self.get_object()
        user.is_banned = True
        user.save()
        return Response({'status': 'user banned'})

    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        user = self.get_object()
        reviews = Review.objects.filter(reviewee=user)
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = ReviewSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'location', 'listing_type', 'user', 'is_active']
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'price', 'views_count']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        listing = self.get_object()
        favorite, created = Favorite.objects.get_or_create(
            user=request.user, 
            listing=listing
        )
        if not created:
            favorite.delete()
            return Response({'status': 'removed from favorites'})
        return Response({'status': 'added to favorites'})

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsParticipant]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        conversation = serializer.save()
        conversation.participants.add(self.request.user)

class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()  
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PaymentTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PaymentTransaction.objects.filter(user=self.request.user)

class SubscriptionPlanViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SubscriptionPlan.objects.filter(is_active=True)
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]

class UserSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Report.objects.all()
        return Report.objects.filter(reporter=self.request.user)

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

# Additional API Views
class ListingImageView(APIView):
    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id)
            if listing.user != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            image_data = request.FILES.get('image')
            if not image_data:
                return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            image = ListingImage.objects.create(
                listing=listing,
                image=image_data,
                is_primary=request.data.get('is_primary', False)
            )
            return Response(ListingImageSerializer(image).data, status=status.HTTP_201_CREATED)
        except Listing.DoesNotExist:
            return Response({'error': 'Listing not found'}, status=status.HTTP_404_NOT_FOUND)

class UserFavoritesView(APIView):
    def get(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

class CustomerBookingsView(APIView):
    def get(self, request):
        bookings = Booking.objects.filter(customer=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class ProviderBookingsView(APIView):
    def get(self, request):
        bookings = Booking.objects.filter(service_provider=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class CancelBookingView(APIView):
    def post(self, request, id):
        try:
            booking = Booking.objects.get(id=id)
            if booking.customer != request.user and booking.service_provider != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            booking.status = 'cancelled'
            booking.save()
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

class ConfirmBookingView(APIView):
    def post(self, request, id):
        try:
            booking = Booking.objects.get(id=id)
            if booking.service_provider != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            booking.status = 'confirmed'
            booking.save()
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

class CompleteBookingView(APIView):
    def post(self, request, id):
        try:
            booking = Booking.objects.get(id=id)
            if booking.service_provider != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            booking.status = 'completed'
            booking.save()
            return Response(BookingSerializer(booking).data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

class ConversationMessagesView(APIView):
    def get(self, request, id):
        try:
            conversation = Conversation.objects.get(id=id)
            if request.user not in conversation.participants.all():
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            messages = Message.objects.filter(conversation=conversation).order_by('sent_at')
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, id):
        try:
            conversation = Conversation.objects.get(id=id)
            if request.user not in conversation.participants.all():
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            message = Message.objects.create(
                sender=request.user,
                conversation=conversation,
                content=request.data.get('content')
            )
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

class MarkConversationReadView(APIView):
    def post(self, request, id):
        try:
            conversation = Conversation.objects.get(id=id)
            if request.user not in conversation.participants.all():
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            Message.objects.filter(conversation=conversation).exclude(sender=request.user).update(is_read=True)
            return Response({'status': 'marked as read'})
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)

class MarkAllNotificationsReadView(APIView):
    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

class UnreadNotificationsCountView(APIView):
    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'count': count})

class AnalyticsEventView(APIView):
    def post(self, request):
        # Implement analytics event tracking
        return Response({'status': 'event tracked'})

class AnalyticsStatsView(APIView):
    def get(self, request):
        # Implement analytics stats retrieval
        return Response({'stats': 'analytics data'})

class CloseServiceRequestView(APIView):
    def post(self, request, id):
        try:
            service_request = ServiceRequest.objects.get(id=id)
            if service_request.customer != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            service_request.status = 'completed'
            service_request.save()
            return Response(ServiceRequestSerializer(service_request).data)
        except ServiceRequest.DoesNotExist:
            return Response({'error': 'Service request not found'}, status=status.HTTP_404_NOT_FOUND)

class AssignServiceRequestView(APIView):
    def post(self, request, id):
        try:
            service_request = ServiceRequest.objects.get(id=id)
            provider_id = request.data.get('provider')
            
            if service_request.customer != request.user:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            try:
                provider = User.objects.get(id=provider_id)
                # Create a booking from the service request
                booking = Booking.objects.create(
                    customer=service_request.customer,
                    service_provider=provider,
                    listing=None,  # You might want to create a service listing for this
                    start_date=timezone.now(),
                    total_price=0,  # Set appropriate price
                    status='confirmed'
                )
                service_request.status = 'in_progress'
                service_request.save()
                return Response(BookingSerializer(booking).data)
            except User.DoesNotExist:
                return Response({'error': 'Provider not found'}, status=status.HTTP_404_NOT_FOUND)
        except ServiceRequest.DoesNotExist:
            return Response({'error': 'Service request not found'}, status=status.HTTP_404_NOT_FOUND)

class ResolveReportView(APIView):
    def post(self, request, id):
        try:
            report = Report.objects.get(id=id)
            if not request.user.is_staff:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            report.status = 'resolved'
            report.resolved_by = request.user
            report.resolved_at = timezone.now()
            report.save()
            return Response(ReportSerializer(report).data)
        except Report.DoesNotExist:
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

class DismissReportView(APIView):
    def post(self, request, id):
        try:
            report = Report.objects.get(id=id)
            if not request.user.is_staff:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            
            report.status = 'dismissed'
            report.resolved_by = request.user
            report.resolved_at = timezone.now()
            report.save()
            return Response(ReportSerializer(report).data)
        except Report.DoesNotExist:
            return Response({'error': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

class FavoriteListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user, 
                listing=listing
            )
            if not created:
                favorite.delete()
                return Response({'status': 'removed from favorites'})
            return Response({'status': 'added to favorites'})
        except Listing.DoesNotExist:
            return Response({'error': 'Listing not found'}, status=status.HTTP_404_NOT_FOUND)

class FavoriteListingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            listing = Listing.objects.get(id=id)
            favorite, created = Favorite.objects.get_or_create(
                user=request.user, 
                listing=listing
            )
            if not created:
                favorite.delete()
                return Response({'status': 'removed from favorites'})
            return Response({'status': 'added to favorites'})
        except Listing.DoesNotExist:
            return Response({'error': 'Listing not found'}, status=status.HTTP_404_NOT_FOUND)                        