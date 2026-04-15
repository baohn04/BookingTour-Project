import { useState, useEffect, useCallback } from 'react';
import { getAdminCategories } from '../services/adminCategoryServices';

export const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [queryParams, setQueryParams] = useState({
    status: '',
    keyword: '',
    sortKey: 'position',
    sortValue: 'desc',
    page: 1,
  });

  const fetchApi = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (queryParams.status) params.append('status', queryParams.status);
      if (queryParams.keyword) params.append('keyword', queryParams.keyword);
      if (queryParams.sortKey) params.append('sortKey', queryParams.sortKey);
      if (queryParams.sortValue) params.append('sortValue', queryParams.sortValue);
      if (queryParams.page) params.append('page', queryParams.page);

      const response = await getAdminCategories(params.toString());
      if (response && response.data) {
        setCategories(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err);
      console.error("Lỗi khi tải danh sách danh mục:", err);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchApi();
  }, [fetchApi]);

  return { categories, pagination, loading, error, queryParams, setQueryParams, refetchCategories: fetchApi };
};
