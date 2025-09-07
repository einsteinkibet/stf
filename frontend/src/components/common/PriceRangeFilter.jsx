import React, { useState } from 'react';
import { Form, Row, Col, Accordion } from 'react-bootstrap';

const PriceRangeFilter = ({ priceRange, onPriceRangeChange }) => {
  const [minPrice, setMinPrice] = useState(priceRange?.min || '');
  const [maxPrice, setMaxPrice] = useState(priceRange?.max || '');

  const handleMinPriceChange = (value) => {
    setMinPrice(value);
    onPriceRangeChange({ min: value, max: maxPrice });
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);
    onPriceRangeChange({ min: minPrice, max: value });
  };

  return (
    <Accordion className="mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Price Range</Accordion.Header>
        <Accordion.Body>
          <Row className="g-2">
            <Col>
              <Form.Label>Min Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                min="0"
              />
            </Col>
            <Col>
              <Form.Label>Max Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                min="0"
              />
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default PriceRangeFilter;