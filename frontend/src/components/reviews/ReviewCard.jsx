import React from 'react';
import { Card, Button } from 'react-bootstrap';
import RatingStars from '../common/RatingStars';
import { formatRelativeTime } from '../../utils/formatters';

const ReviewCard = ({ review, onEdit, onDelete, canModify = false }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="mb-1">{review.reviewer.username}</h6>
            <RatingStars rating={review.rating} />
          </div>
          <small className="text-muted">
            {formatRelativeTime(review.created_at)}
          </small>
        </div>
        
        <p className="mb-3">{review.comment}</p>
        
        {review.listing && (
          <div className="mb-2">
            <small className="text-muted">
              For: {review.listing.title}
            </small>
          </div>
        )}

        {canModify && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onEdit(review)}
            >
              Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(review.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;