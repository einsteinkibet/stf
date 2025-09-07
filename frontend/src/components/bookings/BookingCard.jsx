import React from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { formatDate, formatDateTime } from '../../utils/formatters';

const BookingCard = ({ booking, onAction }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      case 'in_progress': return 'primary';
      default: return 'secondary';
    }
  };

  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canComplete = booking.status === 'in_progress';

  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h6 className="card-title">{booking.listing.title}</h6>
          <Badge bg={getStatusVariant(booking.status)}>
            {booking.status}
          </Badge>
        </div>

        <Row className="mb-2">
          <Col sm={6}>
            <small className="text-muted">Customer:</small>
            <div>{booking.customer.username}</div>
          </Col>
          <Col sm={6}>
            <small className="text-muted">Provider:</small>
            <div>{booking.service_provider.username}</div>
          </Col>
        </Row>

        <Row className="mb-2">
          <Col sm={6}>
            <small className="text-muted">Start:</small>
            <div>{formatDateTime(booking.start_date)}</div>
          </Col>
          {booking.end_date && (
            <Col sm={6}>
              <small className="text-muted">End:</small>
              <div>{formatDateTime(booking.end_date)}</div>
            </Col>
          )}
        </Row>

        <div className="mb-2">
          <small className="text-muted">Total Price:</small>
          <div className="h5 text-primary">{booking.total_price} €</div>
        </div>

        {booking.notes && (
          <div className="mb-3">
            <small className="text-muted">Notes:</small>
            <div>{booking.notes}</div>
          </div>
        )}

        <div className="d-grid gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onAction('view', booking)}
          >
            View Details
          </Button>
          
          {canCancel && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onAction('cancel', booking)}
            >
              Cancel Booking
            </Button>
          )}
          
          {canComplete && (
            <Button
              variant="success"
              size="sm"
              onClick={() => onAction('complete', booking)}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default BookingCard;