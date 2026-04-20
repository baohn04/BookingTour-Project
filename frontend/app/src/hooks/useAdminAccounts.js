import { useState, useEffect, useCallback } from 'react';
import { getAdminAccounts } from '../services/adminAccountServices';

export const useAdminAccounts = (initialPage = 1, limit = 5) => {
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: initialPage,
    limit: limit,
    status: '',
    keyword: '',
  });

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (queryParams.status) params.append('status', queryParams.status);
      if (queryParams.keyword) params.append('keyword', queryParams.keyword);
      if (queryParams.page) params.append('page', queryParams.page);
      if (queryParams.limit) params.append('limit', queryParams.limit);

      const response = await getAdminAccounts(params.toString());
      if (response && response.data) {
        setAccounts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.error("Failed to fetch admin accounts:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    pagination,
    loading,
    error,
    refetchAccounts: fetchAccounts,
    queryParams,
    setQueryParams,
  };
};
