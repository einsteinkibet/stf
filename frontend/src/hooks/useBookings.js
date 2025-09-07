import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api/api';

export const useBookings = (filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getBookings(filters);
      setBookings(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await bookingsAPI.createBooking(bookingData);
      setBookings(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create booking';
      return { success: false, error: errorMessage };
    }
  };

  const updateBooking = async (bookingId, updates) => {
    try {
      const response = await bookingsAPI.updateBooking(bookingId, updates);
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? response.data : booking
      ));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update booking';
      return { success: false, error: errorMessage };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await bookingsAPI.cancelBooking(bookingId);
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel booking';
      return { success: false, error: errorMessage };
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    cancelBooking
  };
};