import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { listingsAPI, categoriesAPI } from '../../api/api';
import LocationPicker from '../common/LocationPicker';
import ImageUpload from '../common/ImageUpload';
import LoadingSpinner from '../common/LoadingSpinner';

const ListingForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    listing_type: 'product',
    price: '',
    condition: '',
    brand: '',
    model: '',
    duration: '',
    is_remote: false
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchListing();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingsAPI.getListing(id);
      const listing = response.data;
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        category: listing.category?.id || '',
        location: listing.location?.id || '',
        listing_type: listing.listing_type || 'product',
        price: listing.price || '',
        condition: listing.condition || '',
        brand: listing.brand || '',
        model: listing.model || '',
        duration: listing.duration || '',
        is_remote: listing.is_remote || false
      });
    } catch (err) {
      setError('Failed to fetch listing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEdit) {
        await listingsAPI.updateListing(id, formData);
      } else {
        await listingsAPI.createListing(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (uploadedImages) => {
    console.log('Images uploaded:', uploadedImages);
  };

  if (loading) return <LoadingSpinner message="Loading listing..." />;

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">
                {isEdit ? 'Edit Listing' : 'Create New Listing'}
              </h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter listing title"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price *</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your item or service in detail..."
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Listing Type *</Form.Label>
                      <Form.Select
                        name="listing_type"
                        value={formData.listing_type}
                        onChange={handleChange}
                        required
                      >
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <LocationPicker
                  value={formData.location}
                  onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                />

                {formData.listing_type === 'product' && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Condition</Form.Label>
                        <Form.Select
                          name="condition"
                          value={formData.condition}
                          onChange={handleChange}
                        >
                          <option value="">Select Condition</option>
                          <option value="new">New</option>
                          <option value="like_new">Like New</option>
                          <option value="used_good">Used - Good</option>
                          <option value="used_fair">Used - Fair</option>
                          <option value="used_poor">Used - Poor</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          placeholder="Brand name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {formData.listing_type === 'service' && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          placeholder="e.g., 1 hour, 2 days"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          name="is_remote"
                          label="Remote Service Available"
                          checked={formData.is_remote}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {isEdit && (
                  <ImageUpload
                    listingId={id}
                    onUploadSuccess={handleImageUpload}
                  />
                )}

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : (isEdit ? 'Update Listing' : 'Create Listing')}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ListingForm;