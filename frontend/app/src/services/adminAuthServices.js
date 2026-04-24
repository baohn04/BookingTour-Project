import { get, post } from '../utils/request';

export const getAdminInfo = async () => {
  const result = await get('admin/info-admin');
  return result;
};


export const loginAdmin = async (options) => {
  const result = await post('admin/auth/login', options);
  return result;
};

export const logoutAdmin = async () => {
  const result = await post('admin/auth/logout');
  return result;
};
