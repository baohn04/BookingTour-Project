import { useQuery } from '@tanstack/react-query';
import { getAdminRoles } from '../services/adminRoleServices';

export const useAdminRoles = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminRoles'],
    queryFn: getAdminRoles,
  });

  return {
    roles: data?.data ?? [],
    loading: isLoading,
    refetchRoles: refetch,
  };
};
