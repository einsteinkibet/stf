import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { listingsAPI } from '../api/api';
import ListingGrid from '../components/listings/ListingGrid';
import ListingFilters from '../components/listings/ListingFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [filters, sortBy, page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        ordering: sortBy === 'created_at' ? '-created_at' : sortBy,
        ...filters
      };
      
      const response = await listingsAPI.getListings(params);
      const newListings = response.data.results || response.data;
      
      if (page === 1) {
        setListings(newListings);
      } else {
        setListings(prev => [...prev, ...newListings]);
      }
      
      setHasMore(response.data.next != null);
    } catch (err) {
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={3}>
          <ListingFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </Col>
        
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Browse Listings</h2>
            <Form.Select
              value={sortBy}
              onChange={handleSortChange}
              style={{ width: 'auto' }}
            >
              <option value="created_at">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="title">Title: A to Z</option>
              <option value="-title">Title: Z to A</option>
            </Form.Select>
          </div>

          <ListingGrid
            listings={listings}
            loading={loading && page === 1}
            error={error}
          />

          {hasMore && !loading && (
            <div className="text-center mt-4">
              <Button variant="outline-primary" onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}

          {loading && page > 1 && (
            <div className="text-center mt-4">
              <LoadingSpinner message="Loading more listings..." />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Listings;