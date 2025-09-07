import React from 'react';
import { Container } from 'react-bootstrap';
import BookingList from '../components/bookings/BookingList';

const Bookings = () => {
  return (
    <Container className="py-4">
      <BookingList />
    </Container>
  );
};

export default Bookings;