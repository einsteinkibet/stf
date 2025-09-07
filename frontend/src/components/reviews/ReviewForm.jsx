import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import RatingStars from '../common/RatingStars';

const ReviewForm = ({ onSubmit, onCancel, initialData, loading = false }) => {
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [comment, setComment] = useState(initialData?.comment || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!comment.trim()) {
      setError('Please enter a review comment');
      return;
    }

    onSubmit({ rating, comment });
  };

  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Write a Review</h5>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 text-center">
            <Form.Label className="d-block">Rating</Form.Label>
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              editable={true}
              size="2rem"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
            {onCancel && (
              <Button
                variant="outline-secondary"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ReviewForm;