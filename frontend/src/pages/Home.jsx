import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { listingsAPI, categoriesAPI } from '../api/api';
import ListingCard from '../components/listings/ListingCard';
import SearchBar from '../components/common/SearchBar';

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsResponse, categoriesResponse] = await Promise.all([
        listingsAPI.getListings({ is_featured: true, limit: 8 }),
        categoriesAPI.getCategories()
      ]);
      
      setFeaturedListings(listingsResponse.data.results);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Hero Section */}
      <Row className="py-5 mb-4 bg-light rounded">
        <Col md={8} className="mx-auto text-center">
          <h1 className="display-4 mb-3">Buy, Sell, and Find Services</h1>
          <p className="lead mb-4">
            The marketplace for second-hand goods and local service providers
          </p>
          <SearchBar />
        </Col>
      </Row>

      {/* Categories Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Browse Categories</h2>
          <Row>
           {(Array.isArray(categories) ? categories.slice(0, 8) : []).map(category => (
              <Col key={category.id} md={3} className="mb-3">
                <Card className="h-100 text-center">
                  <Card.Body>
                    <Card.Title>{category.name}</Card.Title>
                    <Button variant="outline-primary">Browse</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Featured Listings Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Featured Listings</h2>
          <Row>
            {featuredListings.map(listing => (
              <Col key={listing.id} md={6} lg={3} className="mb-4">
                <ListingCard listing={listing} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Call to Action */}
      {!user && (
        <Row className="py-5 bg-primary text-white rounded text-center">
          <Col>
            <h2>Ready to get started?</h2>
            <p className="lead">Join thousands of users buying, selling, and offering services</p>
            <Button variant="light" size="lg" className="me-3">Sign Up</Button>
            <Button variant="outline-light" size="lg">Learn More</Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
