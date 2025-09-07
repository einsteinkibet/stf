import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { serviceRequestsAPI } from '../api/api';
import ServiceRequestList from '../components/service-requests/ServiceRequestList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServiceRequests();
  }, [filter]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { status: filter };
      const response = await serviceRequestsAPI.getServiceRequests(params);
      setRequests(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch service requests:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Service Requests</h2>
            <Button as={Link} to="/service-requests/create" variant="primary">
              ➕ New Request
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex gap-2">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('all')}
                >
                  All Requests
                </Button>
                <Button
                  variant={filter === 'open' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('open')}
                >
                  Open
                </Button>
                <Button
                  variant={filter === 'in_progress' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('in_progress')}
                >
                  In Progress
                </Button>
                <Button
                  variant={filter === 'completed' ? 'primary' : 'outline-primary'}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <LoadingSpinner message="Loading service requests..." />
      ) : (
        <ServiceRequestList requests={requests} onUpdate={fetchServiceRequests} />
      )}
    </Container>
  );
};

export default ServiceRequests;