import { useState, useEffect } from 'react';
import { listingsAPI } from '../api/api';

export const useListings = (filters = {}, dependencies = []) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchListings();
  }, [filters, ...dependencies]);

  const fetchListings = async (newPage = 1) => {
    try {
      setLoading(true);
      const params = {
        page: newPage,
        ...filters
      };
      
      const response = await listingsAPI.getListings(params);
      const newListings = response.data.results || response.data;
      
      if (newPage === 1) {
        setListings(newListings);
      } else {
        setListings(prev => [...prev, ...newListings]);
      }
      
      setHasMore(response.data.next != null);
      setPage(newPage);
    } catch (err) {
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchListings(page + 1);
    }
  };

  const refresh = () => {
    fetchListings(1);
  };

  return {
    listings,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    page
  };
};