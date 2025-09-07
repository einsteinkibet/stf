import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { listingsAPI } from '../api/api';
import ListingGrid from '../components/listings/ListingGrid';
import ListingFilters from '../components/listings/ListingFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});

  const query = searchParams.get('q') || '';

  useEffect(() => {
    performSearch();
  }, [query, filters]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const searchFilters = {
        search: query,
        ...filters
      };
      
      const response = await listingsAPI.getListings(searchFilters);
      setListings(response.data.results || response.data);
    } catch (err) {
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Search Results</h2>
          <p className="text-muted">
            {query ? `Searching for: "${query}"` : 'Browse all listings'}
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <ListingFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </Col>
        
        <Col md={9}>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <ListingGrid
            listings={listings}
            loading={loading}
            error=""
          />

          {!loading && listings.length === 0 && (
            <Alert variant="info" className="text-center">
              No listings found matching your search criteria. Try adjusting your filters or search terms.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchResults;