import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, ButtonGroup, Button } from 'react-bootstrap';
import { bookingsAPI } from '../../api/api';
import BookingCard from './BookingCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getCustomerBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (filter === 'all') {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === filter));
    }
  };

  const handleAction = async (action, booking) => {
    try {
      switch (action) {
        case 'cancel':
          await bookingsAPI.cancelBooking(booking.id);
          break;
        case 'complete':
          await bookingsAPI.completeBooking(booking.id);
          break;
        default:
          break;
      }
      fetchBookings(); // Refresh the list
    } catch (err) {
      setError(`Failed to ${action} booking`);
    }
  };

  if (loading) return <LoadingSpinner message="Loading bookings..." />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Bookings</h2>
        <ButtonGroup>
          <Button
            variant={filter === 'all' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'outline-primary'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </ButtonGroup>
      </div>

      {filteredBookings.length === 0 ? (
        <Alert variant="info" className="text-center">
          No bookings found. {filter !== 'all' && `Try changing the filter.`}
        </Alert>
      ) : (
        <Row>
          {filteredBookings.map(booking => (
            <Col key={booking.id} md={6} lg={4} className="mb-4">
              <BookingCard
                booking={booking}
                onAction={handleAction}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BookingList;