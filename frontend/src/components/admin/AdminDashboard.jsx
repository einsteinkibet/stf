import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { analyticsAPI, listingsAPI, usersAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, listingsResponse, analyticsResponse] = await Promise.all([
        usersAPI.getUsers(),
        listingsAPI.getListings(),
        analyticsAPI.getStats()
      ]);

      const users = usersResponse.data.results || usersResponse.data;
      const listings = listingsResponse.data.results || listingsResponse.data;

      setStats({
        totalUsers: users.length,
        totalListings: listings.length,
        totalBookings: analyticsResponse.data.total_bookings || 0,
        totalRevenue: analyticsResponse.data.total_revenue || 0
      });

      setRecentActivities(analyticsResponse.data.recent_activities || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;

  return (
    <div>
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-primary">
                {stats.totalUsers}
              </Card.Title>
              <Card.Text>Total Users</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-success">
                {stats.totalListings}
              </Card.Title>
              <Card.Text>Total Listings</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-warning">
                {stats.totalBookings}
              </Card.Title>
              <Card.Text>Total Bookings</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-info">
                ${stats.totalRevenue.toFixed(2)}
              </Card.Title>
              <Card.Text>Total Revenue</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.user}</td>
                      <td>
                        <Badge bg="secondary">{activity.action}</Badge>
                      </td>
                      <td>{activity.target}</td>
                      <td>{new Date(activity.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                  {recentActivities.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        No recent activities
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">View Reports</button>
                <button className="btn btn-outline-success">Manage Users</button>
                <button className="btn btn-outline-warning">Moderate Content</button>
                <button className="btn btn-outline-info">View Analytics</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;