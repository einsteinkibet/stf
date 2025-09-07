import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listingsAPI, bookingsAPI, reviewsAPI } from '../api/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    listings: 0,
    bookings: 0,
    reviews: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [listingsResponse, bookingsResponse, reviewsResponse] = await Promise.all([
        listingsAPI.getListings({ user: user.id }),
        bookingsAPI.getCustomerBookings(),
        reviewsAPI.getUserReviews(user.id)
      ]);

      const listings = listingsResponse.data.results || listingsResponse.data;
      const bookings = bookingsResponse.data.results || bookingsResponse.data;
      const reviews = reviewsResponse.data.results || reviewsResponse.data;

      setStats({
        listings: listings.length,
        bookings: bookings.length,
        reviews: reviews.length,
        earnings: bookings.reduce((sum, booking) => sum + parseFloat(booking.total_price), 0)
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Dashboard</h2>
          <p className="text-muted">Welcome back, {user.username}!</p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-primary">
                {stats.listings}
              </Card.Title>
              <Card.Text>Listings</Card.Text>
              <Button as={Link} to="/listings/create" variant="outline-primary" size="sm">
                Create New
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-success">
                {stats.bookings}
              </Card.Title>
              <Card.Text>Bookings</Card.Text>
              <Button as={Link} to="/bookings" variant="outline-success" size="sm">
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-warning">
                {stats.reviews}
              </Card.Title>
              <Card.Text>Reviews</Card.Text>
              <Button as={Link} to={`/profile/${user.username}`} variant="outline-warning" size="sm">
                View Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-info">
                ${stats.earnings.toFixed(2)}
              </Card.Title>
              <Card.Text>Earnings</Card.Text>
              <Button as={Link} to="/payments" variant="outline-info" size="sm">
                View Payments
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/listings/create" variant="primary">
                  🛍️ Create New Listing
                </Button>
                <Button as={Link} to="/service-requests/create" variant="success">
                  🔧 Post Service Request
                </Button>
                <Button as={Link} to="/messages" variant="info">
                  💬 Check Messages
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted text-center">
                Activity feed will be displayed here
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;