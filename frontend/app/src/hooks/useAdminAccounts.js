import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminAccounts } from '../services/adminAccountServices';

const buildQueryString = (queryParams) => {
  const params = new URLSearchParams();
  if (queryParams.status) params.append('status', queryParams.status);
  if (queryParams.keyword) params.append('keyword', queryParams.keyword);
  if (queryParams.page) params.append('page', queryParams.page);
  if (queryParams.limit) params.append('limit', queryParams.limit);
  return params.toString();
};

export const useAdminAccounts = (initialPage = 1, limit = 5) => {
  const [queryParams, setQueryParams] = useState({
    page: initialPage,
    limit: limit,
    status: '',
    keyword: '',
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminAccounts', queryParams],
    queryFn: () => getAdminAccounts(buildQueryString(queryParams)),
  });

  return {
    accounts: data?.data ?? [],
    pagination: data?.pagination ?? null,
    loading: isLoading,
    error,
    refetchAccounts: refetch,
    queryParams,
    setQueryParams,
  };
};
