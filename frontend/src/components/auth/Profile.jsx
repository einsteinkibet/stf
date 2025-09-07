import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Tab, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { reviewsAPI, listingsAPI } from '../../api/api';
import RatingStars from '../common/RatingStars';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [reviewsResponse, listingsResponse] = await Promise.all([
        reviewsAPI.getUserReviews(user.id),
        listingsAPI.getListings({ user: user.id })
      ]);
      
      setReviews(reviewsResponse.data);
      setListings(listingsResponse.data.results || listingsResponse.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <span className="text-white h4">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </Col>
                <Col md={9}>
                  <h2>{user.username}</h2>
                  <Badge bg="secondary" className="mb-2">
                    {user.account_type}
                  </Badge>
                  <p className="text-muted mb-1">{user.email}</p>
                  {user.phoneNumber && (
                    <p className="text-muted mb-1">{user.phoneNumber}</p>
                  )}
                  {user.bio && (
                    <p className="mt-2">{user.bio}</p>
                  )}
                  <div className="d-flex align-items-center mt-2">
                    <RatingStars rating={averageRating} />
                    <span className="ms-2">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body className="text-center">
              <h5>Stats</h5>
              <Row>
                <Col>
                  <div className="h4">{listings.length}</div>
                  <div className="text-muted">Listings</div>
                </Col>
                <Col>
                  <div className="h4">{reviews.length}</div>
                  <div className="text-muted">Reviews</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tab.Container defaultActiveKey="listings">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="listings">Listings ({listings.length})</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="reviews">Reviews ({reviews.length})</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="listings">
            {listings.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <h5>No listings yet</h5>
                  <p className="text-muted">Start by creating your first listing!</p>
                  <Button variant="primary">Create Listing</Button>
                </Card.Body>
              </Card>
            ) : (
              <Row>
                {listings.map(listing => (
                  <Col key={listing.id} md={6} lg={4} className="mb-3">
                    {/* You can use your ListingCard component here */}
                    <Card>
                      <Card.Body>
                        <h6>{listing.title}</h6>
                        <p className="text-muted small">{listing.description}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="reviews">
            {reviews.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <h5>No reviews yet</h5>
                  <p className="text-muted">Reviews will appear here once you receive them.</p>
                </Card.Body>
              </Card>
            ) : (
              <div>
                {reviews.map(review => (
                  <Card key={review.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <RatingStars rating={review.rating} />
                          <p className="mt-2 mb-1">{review.comment}</p>
                          <small className="text-muted">
                            By {review.reviewer.username} • {new Date(review.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Profile;