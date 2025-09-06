import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

const ListingCard = ({ listing }) => {
  return (
    <Card className="h-100 listing-card">
      {listing.images && listing.images.length > 0 && (
        <Card.Img 
          variant="top" 
          src={listing.images[0].image} 
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Badge bg={listing.listing_type === 'product' ? 'info' : 'success'} className="me-1">
            {listing.listing_type}
          </Badge>
          {listing.is_featured && <Badge bg="warning">Featured</Badge>}
        </div>
        
        <Card.Title className="h6">{listing.title}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {listing.description.length > 100 
            ? `${listing.description.substring(0, 100)}...` 
            : listing.description
          }
        </Card.Text>
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="h5 text-primary mb-0">{formatPrice(listing.price)}</span>
            <small className="text-muted">{listing.location?.name}</small>
          </div>
          
          <Button 
            as={Link} 
            to={`/listings/${listing.id}`} 
            variant="primary" 
            size="sm" 
            className="w-100"
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ListingCard;
