import { useState, useEffect, useCallback } from 'react';
import { getAdminOrders } from '../services/adminOrderServices';

export const useAdminOrders = (initialPage = 1, limit = 5) => {
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [queryParams, setQueryParams] = useState({
    page: initialPage,
    limit: limit,
    status: '',
    keyword: '',
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (queryParams.status) params.append('status', queryParams.status);
      if (queryParams.keyword) params.append('keyword', queryParams.keyword);
      if (queryParams.page) params.append('page', queryParams.page);
      if (queryParams.limit) params.append('limit', queryParams.limit);

      const response = await getAdminOrders(params.toString());
      if (response && response.data) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination);
        setStatistics(response.data.statistics || { total: 0, pending: 0, confirmed: 0, cancelled: 0 });
      }
    } catch (error) {
      console.error("Failed to fetch admin orders:", error);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    statistics,
    pagination,
    loading,
    refetchOrders: fetchOrders,
    queryParams,
    setQueryParams,
  };
};
