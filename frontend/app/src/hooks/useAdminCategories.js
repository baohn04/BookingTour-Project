import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminCategories } from '../services/adminCategoryServices';

const buildQueryString = (queryParams) => {
  const params = new URLSearchParams();
  if (queryParams.status) params.append('status', queryParams.status);
  if (queryParams.keyword) params.append('keyword', queryParams.keyword);
  if (queryParams.sortKey) params.append('sortKey', queryParams.sortKey);
  if (queryParams.sortValue) params.append('sortValue', queryParams.sortValue);
  if (queryParams.page) params.append('page', queryParams.page);
  return params.toString();
};

export const useAdminCategories = () => {
  const [queryParams, setQueryParams] = useState({
    status: '',
    keyword: '',
    sortKey: 'position',
    sortValue: 'desc',
    page: 1,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['adminCategories', queryParams],
    queryFn: () => getAdminCategories(buildQueryString(queryParams)),
  });

  return {
    categories: data?.data ?? [],
    pagination: data?.pagination ?? {},
    loading: isLoading,
    error,
    queryParams,
    setQueryParams,
    refetchCategories: refetch,
  };
};
