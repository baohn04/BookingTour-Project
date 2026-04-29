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

export const forgotPasswordAdmin = async (options) => {
  const result = await post('admin/auth/password/forgot', options);
  return result;
};

export const verifyOtpAdmin = async (options) => {
  const result = await post('admin/auth/password/otp', options);
  return result;
};

export const resetPasswordAdmin = async (options) => {
  const result = await post('admin/auth/password/reset', options);
  return result;
};
