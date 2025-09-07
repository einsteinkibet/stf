import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import { listingsAPI, reviewsAPI } from '../../api/api';
import ImageGallery from './ImageGallery';
import RatingStars from '../common/RatingStars';
import LoadingSpinner from '../common/LoadingSpinner';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const [listingResponse, reviewsResponse] = await Promise.all([
        listingsAPI.getListing(id),
        reviewsAPI.getReviews({ listing: id })
      ]);
      
      setListing(listingResponse.data);
      setReviews(reviewsResponse.data.results || reviewsResponse.data);
    } catch (err) {
      setError('Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading listing..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!listing) return <Alert variant="warning">Listing not found</Alert>;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <ImageGallery images={listing.images || []} />
          
          <Card className="mt-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1>{listing.title}</h1>
                  <Badge bg={listing.listing_type === 'product' ? 'info' : 'success'} className="me-2">
                    {listing.listing_type}
                  </Badge>
                  {listing.is_featured && <Badge bg="warning">Featured</Badge>}
                </div>
                <h3 className="text-primary">{listing.price} €</h3>
              </div>

              <p className="lead">{listing.description}</p>

              {listing.condition && (
                <p><strong>Condition:</strong> {listing.condition}</p>
              )}
              {listing.brand && (
                <p><strong>Brand:</strong> {listing.brand}</p>
              )}
              {listing.model && (
                <p><strong>Model:</strong> {listing.model}</p>
              )}
              {listing.duration && (
                <p><strong>Duration:</strong> {listing.duration}</p>
              )}
              {listing.is_remote && (
                <p><strong>Remote Service:</strong> Yes</p>
              )}
            </Card.Body>
          </Card>

          {/* Reviews Section */}
          <Card className="mt-4">
            <Card.Body>
              <h4>Reviews</h4>
              {reviews.length === 0 ? (
                <p className="text-muted">No reviews yet</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{review.reviewer.username}</strong>
                      <RatingStars rating={review.rating} />
                    </div>
                    <p className="mb-1">{review.comment}</p>
                    <small className="text-muted">
                      {new Date(review.created_at).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Seller Information</h5>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                  style={{ width: '50px', height: '50px' }}
                >
                  <span className="text-white">
                    {listing.user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <strong>{listing.user.username}</strong>
                  <div className="d-flex align-items-center">
                    <RatingStars rating={listing.user.average_rating || 0} size="0.8rem" />
                    <span className="ms-2 small">
                      ({listing.user.total_reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg">
                  💬 Message Seller
                </Button>
                {listing.listing_type === 'service' && (
                  <Button variant="success" size="lg">
                    📅 Book Service
                  </Button>
                )}
                <Button variant="outline-secondary">
                  ❤️ Add to Favorites
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h6>Listing Details</h6>
              <p><strong>Category:</strong> {listing.category?.name}</p>
              <p><strong>Location:</strong> {listing.location?.name}</p>
              <p><strong>Posted:</strong> {new Date(listing.created_at).toLocaleDateString()}</p>
              <p><strong>Views:</strong> {listing.views_count}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListingDetail;