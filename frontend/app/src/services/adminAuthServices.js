import { get, post } from '../utils/request';

export const getAdminInfo = async () => {
  const result = await get('admin/info-admin');
  return result;
};

export const loginAdmin = async (options) => {
  const result = await post('admin/auth/login', options);
  return result;
};

export const logoutAdmin = async (refreshToken) => {
  const result = await post('admin/auth/logout', { refreshToken });
  return result;
};

export const refreshTokenAdmin = async (refreshToken) => {
  const result = await post('admin/auth/refresh-token', { refreshToken });
  return result;
};
