import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import ListingCard from './ListingCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ListingGrid = ({ listings, loading, error, columns = 3 }) => {
  if (loading) {
    return <LoadingSpinner message="Loading listings..." />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!listings || listings.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        No listings found. Try adjusting your search criteria.
      </Alert>
    );
  }

  return (
    <Row>
      {listings.map(listing => (
        <Col key={listing.id} md={12 / columns} className="mb-4">
          <ListingCard listing={listing} />
        </Col>
      ))}
    </Row>
  );
};

export default ListingGrid;