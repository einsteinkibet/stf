import { useState, useEffect } from 'react';
import { serviceRequestsAPI } from '../api/api';

export const useServiceRequests = (filters = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await serviceRequestsAPI.getServiceRequests(filters);
      setRequests(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch service requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  const createRequest = async (requestData) => {
    try {
      const response = await serviceRequestsAPI.createServiceRequest(requestData);
      setRequests(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create service request';
      return { success: false, error: errorMessage };
    }
  };

  return { requests, loading, error, createRequest, refresh: fetchRequests };
};
