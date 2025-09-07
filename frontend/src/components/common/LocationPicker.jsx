import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { locationsAPI } from '../../api/api';

const LocationPicker = ({ value, onChange, error }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await locationsAPI.getLocations();
      setLocations(response.data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading locations...</div>;
  }

  return (
    <Form.Group className="mb-3">
      <Form.Label>Location</Form.Label>
      <Form.Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        isInvalid={!!error}
      >
        <option value="">Select Location</option>
        {locations.map(location => (
          <option key={location.id} value={location.id}>
            {location.name}{location.state ? `, ${location.state}` : ''}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default LocationPicker;