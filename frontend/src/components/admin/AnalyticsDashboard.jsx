import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { analyticsAPI, listingsAPI, usersAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [popularListings, setPopularListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [analyticsResponse, listingsResponse] = await Promise.all([
        analyticsAPI.getStats(),
        listingsAPI.getListings({ ordering: '-views_count', limit: 5 })
      ]);

      setAnalytics(analyticsResponse.data);
      setPopularListings(listingsResponse.data.results || listingsResponse.data);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  return (
    <div>
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-primary">
                {analytics.total_views || 0}
              </Card.Title>
              <Card.Text>Total Views</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-success">
                {analytics.total_clicks || 0}
              </Card.Title>
              <Card.Text>Total Clicks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-warning">
                {analytics.conversion_rate || '0%'}
              </Card.Title>
              <Card.Text>Conversion Rate</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title as="h3" className="text-info">
                {analytics.avg_session_duration || '0m'}
              </Card.Title>
              <Card.Text>Avg. Session</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Popular Listings</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Views</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {popularListings.map(listing => (
                    <tr key={listing.id}>
                      <td>{listing.title}</td>
                      <td>{listing.views_count}</td>
                      <td>
                        <span className={`badge bg-${listing.listing_type === 'product' ? 'info' : 'success'}`}>
                          {listing.listing_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Traffic Sources</h5>
            </Card.Header>
            <Card.Body>
              {analytics.traffic_sources ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Source</th>
                      <th>Visitors</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(analytics.traffic_sources).map(([source, data]) => (
                      <tr key={source}>
                        <td>{source}</td>
                        <td>{data.visitors}</td>
                        <td>{data.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No traffic data available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;