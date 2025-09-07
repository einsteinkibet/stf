import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { reviewsAPI, bookingsAPI } from '../api/api';
import RatingStars from '../components/common/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CreateReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await bookingsAPI.getBooking(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await reviewsAPI.createReview({
        rating,
        comment,
        booking: bookingId,
        reviewee: booking.service_provider.id
      });
      navigate(`/profile/${booking.service_provider.username}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading booking details..." />;
  if (!booking) return <Alert variant="danger">Booking not found</Alert>;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Write a Review</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}

              <div className="text-center mb-4">
                <h5>Service: {booking.listing.title}</h5>
                <p className="text-muted">
                  Provider: {booking.service_provider.username}
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4 text-center">
                  <Form.Label className="d-block">Rating</Form.Label>
                  <RatingStars
                    rating={rating}
                    onRatingChange={setRating}
                    editable={true}
                    size="2rem"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Your Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this service provider..."
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateReview;