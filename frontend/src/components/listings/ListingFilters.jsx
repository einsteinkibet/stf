import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import CategoryFilter from '../common/CategoryFilter';
import PriceRangeFilter from '../common/PriceRangeFilter';

const ListingFilters = ({ filters, onFiltersChange, onReset }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (newFilters) => {
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleInputChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryChange = (categories) => {
    handleFilterChange({ ...localFilters, categories });
  };

  const handlePriceRangeChange = (priceRange) => {
    handleFilterChange({ ...localFilters, priceRange });
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Filters</h5>
          <Button variant="outline-secondary" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search listings..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Listing Type</Form.Label>
          <Form.Select
            value={localFilters.listing_type || ''}
            onChange={(e) => handleInputChange('listing_type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </Form.Select>
        </Form.Group>

        <CategoryFilter
          selectedCategories={localFilters.categories || []}
          onCategoryChange={handleCategoryChange}
        />

        <PriceRangeFilter
          priceRange={localFilters.priceRange || {}}
          onPriceRangeChange={handlePriceRangeChange}
        />

        <Form.Group className="mb-3">
          <Form.Label>Condition</Form.Label>
          <Form.Select
            value={localFilters.condition || ''}
            onChange={(e) => handleInputChange('condition', e.target.value)}
          >
            <option value="">Any Condition</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="used_good">Used - Good</option>
            <option value="used_fair">Used - Fair</option>
            <option value="used_poor">Used - Poor</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Featured Listings Only"
            checked={localFilters.featured || false}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Remote Services Only"
            checked={localFilters.remote || false}
            onChange={(e) => handleInputChange('remote', e.target.checked)}
          />
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default ListingFilters;