import { useState, useEffect } from 'react';
import { serviceRequestsAPI } from '../api/api';

export const useServiceRequests = (filters = {}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceRequests();
  }, [filters]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await serviceRequestsAPI.getServiceRequests(filters);
      setRequests(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch service requests');
    } finally {
      setLoading(false);
    }
  };

  const createServiceRequest = async (requestData) => {
    try {
      const response = await serviceRequestsAPI.createServiceRequest(requestData);
      setRequests(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create service request';
      return { success: false, error: errorMessage };
    }
  };

  const updateServiceRequest = async (requestId, updates) => {
    try {
      const response = await serviceRequestsAPI.updateServiceRequest(requestId, updates);
      setRequests(prev => prev.map(request => 
        request.id === requestId ? response.data : request
      ));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update service request';
      return { success: false, error: errorMessage };
    }
  };

  const deleteServiceRequest = async (requestId) => {
    try {
      await serviceRequestsAPI.deleteServiceRequest(requestId);
      setRequests(prev => prev.filter(request => request.id !== requestId));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete service request';
      return { success: false, error: errorMessage };
    }
  };

  return {
    requests,
    loading,
    error,
    fetchServiceRequests,
    createServiceRequest,
    updateServiceRequest,
    deleteServiceRequest
  };
};