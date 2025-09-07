import React from 'react';
import { Alert } from 'react-bootstrap';
import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews, onEdit, onDelete, canModify = false }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        No reviews yet. Be the first to leave a review!
      </Alert>
    );
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Reviews ({reviews.length})</h5>
        {reviews.length > 0 && (
          <div className="text-muted">
            Average: {averageRating.toFixed(1)} ⭐
          </div>
        )}
      </div>

      {reviews.map(review => (
        <ReviewCard
          key={review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
          canModify={canModify}
        />
      ))}
    </div>
  );
};

export default ReviewList;