import { get, patch, del } from '../utils/request';

export const getAdminOrders = async (queryString = "") => {
  const result = await get(`admin/orders${queryString ? `?${queryString}` : ''}`);
  return result;
};

export const getAdminDetailOrder = async (id) => {
  return await get(`admin/orders/detail/${id}`);
};

export const changeOrderStatus = async (status, id) => {
  return await patch(`admin/orders/change-status/${status}/${id}`);
};

export const deleteAdminOrder = async (id) => {
  return await del(`admin/orders/delete/${id}`);
};
