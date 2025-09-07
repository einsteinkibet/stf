import React, { useState, useEffect } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { wishlistAPI } from '../api/api';
import ListingGrid from '../components/listings/ListingGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading wishlist..." />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <h2>My Wishlist</h2>
        <p className="text-muted">Items you're interested in purchasing</p>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {wishlist.length === 0 ? (
        <Alert variant="info" className="text-center">
          Your wishlist is empty. Add items by clicking the wishlist icon on listings!
        </Alert>
      ) : (
        <ListingGrid
          listings={wishlist}
          loading={false}
          error=""
        />
      )}
    </Container>
  );
};

export default Wishlist;