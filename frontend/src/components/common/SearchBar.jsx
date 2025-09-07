import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="g-2">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search for products, services, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </Col>
        <Col xs="auto">
          <Button type="submit" variant="primary" size="lg">
            🔍 Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;