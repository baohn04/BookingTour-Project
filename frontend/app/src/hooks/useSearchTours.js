import { useState, useEffect } from 'react';
import { searchTours } from '../services/tourServices';

/**
 * Hook tìm kiếm tour.
 * Nhận các giá trị primitive riêng lẻ thay vì object để dependency array
 * hoạt động chính xác và tránh re-render không cần thiết.
 */
export const useSearchTours = ({ keyword, timeStart, timeEnd, categoryId, sortKey, sortValue }) => {
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const hasFilter = keyword || timeStart || timeEnd || (categoryId && categoryId !== 'all');

    if (!hasFilter) {
      setTours([]);
      setTotal(0);
      return;
    }

    let cancelled = false;

    const fetchTours = async () => {
      setLoading(true);
      try {
        const result = await searchTours({ keyword, timeStart, timeEnd, categoryId, sortKey, sortValue });
        if (!cancelled && result && result.data) {
          setTours(result.data);
          setTotal(result.total ?? result.data.length);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Search tours error:', error);
          setTours([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTours();

    // Cleanup: hủy kết quả nếu params thay đổi trước khi fetch xong
    return () => { cancelled = true; };
  }, [keyword, timeStart, timeEnd, categoryId, sortKey, sortValue]);

  return { loading, tours, total };
};
