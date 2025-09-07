import React from 'react';
import { Stack } from 'react-bootstrap';

const RatingStars = ({ rating, maxRating = 5, size = '1rem', onRatingChange, editable = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const handleStarClick = (newRating) => {
    if (editable && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <Stack direction="horizontal" gap={1}>
      {/* Full stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <span
          key={`full-${i}`}
          style={{ cursor: editable ? 'pointer' : 'default', fontSize: size }}
          onClick={() => handleStarClick(i + 1)}
        >
          ⭐
        </span>
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <span
          style={{ cursor: editable ? 'pointer' : 'default', fontSize: size }}
          onClick={() => handleStarClick(fullStars + 1)}
        >
          ⭐
        </span>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span
          key={`empty-${i}`}
          style={{ cursor: editable ? 'pointer' : 'default', fontSize: size }}
          onClick={() => handleStarClick(fullStars + i + 1 + (hasHalfStar ? 1 : 0))}
        >
          ☆
        </span>
      ))}
      
      {!editable && (
        <span className="text-muted ms-2 small">
          ({rating.toFixed(1)})
        </span>
      )}
    </Stack>
  );
};

export default RatingStars;