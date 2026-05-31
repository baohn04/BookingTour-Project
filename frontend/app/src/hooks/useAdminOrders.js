import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminOrders } from '../services/adminOrderServices';

const buildQueryString = (queryParams) => {
  const params = new URLSearchParams();
  if (queryParams.status) params.append('status', queryParams.status);
  if (queryParams.keyword) params.append('keyword', queryParams.keyword);
  if (queryParams.page) params.append('page', queryParams.page);
  if (queryParams.limit) params.append('limit', queryParams.limit);
  return params.toString();
};

export const useAdminOrders = (initialPage = 1, limit = 5) => {
  const [queryParams, setQueryParams] = useState({
    page: initialPage,
    limit: limit,
    status: '',
    keyword: '',
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminOrders', queryParams],
    queryFn: () => getAdminOrders(buildQueryString(queryParams)),
  });

  return {
    orders: data?.data?.orders ?? [],
    statistics: data?.data?.statistics ?? { total: 0, pending: 0, confirmed: 0, cancelled: 0 },
    pagination: data?.data?.pagination ?? null,
    loading: isLoading,
    refetchOrders: refetch,
    queryParams,
    setQueryParams,
  };
};
