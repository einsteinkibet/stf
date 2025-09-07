import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { formatRelativeTime, formatPrice } from '../../utils/formatters';

const ServiceRequestCard = ({ request, onView, onApply, onUpdate, canApply = false, canManage = false }) => {
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

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title">{request.title}</h6>
          <Badge bg={getStatusVariant(request.status)}>
            {request.status}
          </Badge>
        </div>

        <p className="text-muted mb-2">{request.description}</p>

        <div className="mb-2">
          <small className="text-muted">Category: </small>
          <Badge bg="secondary" className="ms-1">
            {request.category}
          </Badge>
          
          {request.urgency && (
            <>
              <small className="text-muted ms-3">Urgency: </small>
              <Badge bg={getUrgencyVariant(request.urgency)} className="ms-1">
                {request.urgency}
              </Badge>
            </>
          )}
        </div>

        <div className="mb-2">
          {request.budget && (
            <small className="text-muted">
              Budget: {formatPrice(request.budget)}
            </small>
          )}
          {request.location && (
            <small className="text-muted ms-3">
              Location: {request.location}
            </small>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            By {request.customer.username} • {formatRelativeTime(request.created_at)}
          </small>
          
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onView(request)}
            >
              View
            </Button>
            
            {canApply && request.status === 'open' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onApply(request)}
              >
                Apply
              </Button>
            )}
            
            {canManage && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => onUpdate(request)}
              >
                Update
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ServiceRequestCard;