import { useState, useEffect, useCallback } from 'react';
import { getAdminRoles } from '../services/adminRoleServices';

export const useAdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminRoles();
      if (res && res.data) {
        setRoles(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch roles", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    loading,
    refetchRoles: fetchRoles
  };
};
