import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Container } from 'react-bootstrap';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import ServiceRequests from './pages/ServiceRequests';
import Favorites from './pages/Favorites';
import Wishlist from './pages/Wishlist';
import Payments from './pages/Payments';
import Subscriptions from './pages/Subscriptions';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import SearchResults from './pages/SearchResults';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import CreateBooking from './pages/CreateBooking';
import CreateReview from './pages/CreateReview';
import CreateServiceRequest from './pages/CreateServiceRequest';
import Admin from './pages/Admin';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Container fluid="xxl" className="py-3">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
                <Route path="/listings/create" element={<CreateListing />} />
                <Route path="/listings/edit/:id" element={<EditListing />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/service-requests" element={<ServiceRequests />} />
                <Route path="/service-requests/create" element={<CreateServiceRequest />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/auth/*" element={<Auth />} />
                <Route path="/bookings/create/:listingId" element={<CreateBooking />} />
                <Route path="/reviews/create/:bookingId" element={<CreateReview />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </Container>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
