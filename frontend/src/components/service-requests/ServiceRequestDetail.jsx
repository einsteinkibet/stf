import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Badge, Alert, Row, Col } from 'react-bootstrap';
import { serviceRequestsAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatRelativeTime, formatPrice } from '../../utils/formatters';

const ServiceRequestDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServiceRequest();
  }, [id]);

  const fetchServiceRequest = async () => {
    try {
      const response = await serviceRequestsAPI.getServiceRequest(id);
      setRequest(response.data);
    } catch (err) {
      setError('Failed to fetch service request details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'open': return 'success';
      case 'in_progress': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getUrgencyVariant = (urgency) => {
    switch (urgency) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'normal': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  if (loading) return <LoadingSpinner message="Loading service request..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!request) return <Alert variant="warning">Service request not found</Alert>;

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2>{request.title}</h2>
                <Badge bg={getStatusVariant(request.status)}>
                  {request.status}
                </Badge>
              </div>

              <div className="mb-4">
                <p className="lead">{request.description}</p>
              </div>

              <Row className="mb-4">
                <Col md={6}>
                  <h6>Details</h6>
                  <p>
                    <strong>Category:</strong>{' '}
                    <Badge bg="secondary">{request.category}</Badge>
                  </p>
                  {request.urgency && (
                    <p>
                      <strong>Urgency:</strong>{' '}
                      <Badge bg={getUrgencyVariant(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </p>
                  )}
                  {request.budget && (
                    <p>
                      <strong>Budget:</strong> {formatPrice(request.budget)}
                    </p>
                  )}
                  {request.location && (
                    <p>
                      <strong>Location:</strong> {request.location}
                    </p>
                  )}
                </Col>
                <Col md={6}>
                  <h6>Timeline</h6>
                  <p>
                    <strong>Created:</strong>{' '}
                    {new Date(request.created_at).toLocaleString()}
                  </p>
                  {request.updated_at !== request.created_at && (
                    <p>
                      <strong>Updated:</strong>{' '}
                      {new Date(request.updated_at).toLocaleString()}
                    </p>
                  )}
                </Col>
              </Row>

              <div className="d-grid gap-2">
                <Button variant="primary" size="lg">
                  Apply for this Service
                </Button>
                <Button variant="outline-secondary">
                  Message Customer
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Customer Information</h5>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
                  style={{ width: '50px', height: '50px' }}
                >
                  <span className="text-white">
                    {request.customer.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <strong>{request.customer.username}</strong>
                  <br />
                  <small className="text-muted">
                    Member since {new Date(request.customer.created_at).getFullYear()}
                  </small>
                </div>
              </div>

              <div className="mt-4">
                <h6>Service Request Stats</h6>
                <p className="mb-1">
                  <small className="text-muted">Status: </small>
                  <Badge bg={getStatusVariant(request.status)}>
                    {request.status}
                  </Badge>
                </p>
                <p className="mb-1">
                  <small className="text-muted">Applications: </small>
                  <strong>0</strong>
                </p>
                <p className="mb-0">
                  <small className="text-muted">Views: </small>
                  <strong>0</strong>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceRequestDetail;