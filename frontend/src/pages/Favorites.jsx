import React, { useState, useEffect } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { favoritesAPI } from '../api/api';
import ListingGrid from '../components/listings/ListingGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getFavorites();
      // Assuming the API returns an array of listing objects
      setFavorites(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId) => {
    try {
      await favoritesAPI.removeFavorite(listingId);
      setFavorites(prev => prev.filter(item => item.id !== listingId));
    } catch (err) {
      setError('Failed to remove favorite');
    }
  };

  if (loading) return <LoadingSpinner message="Loading favorites..." />;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <h2>My Favorites</h2>
        <p className="text-muted">Your saved listings and services</p>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {favorites.length === 0 ? (
        <Alert variant="info" className="text-center">
          You haven't added any favorites yet. Start browsing listings and click the heart icon to save them!
        </Alert>
      ) : (
        <ListingGrid
          listings={favorites}
          loading={false}
          error=""
        />
      )}
    </Container>
  );
};

export default Favorites;