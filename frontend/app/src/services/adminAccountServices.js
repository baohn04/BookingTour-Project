import { get, postForm, patchForm, patch, del } from '../utils/request';

export const getAdminAccounts = async (queryString = "") => {
  const result = await get(`admin/account-admin${queryString ? `?${queryString}` : ''}`);
  return result;
};

export const getAdminAccountCreate = async () => {
  const result = await get(`admin/account-admin/create`);
  return result;
};

export const createAdminAccount = async (options) => {
  const result = await postForm('admin/account-admin/create', options);
  return result;
};

export const getAdminAccountEdit = async (id) => {
  const result = await get(`admin/account-admin/edit/${id}`);
  return result;
};

export const editAdminAccount = async (id, options) => {
  const result = await patchForm(`admin/account-admin/edit/${id}`, options);
  return result;
};

export const deleteAdminAccount = async (id) => {
  const result = await del(`admin/account-admin/delete/${id}`);
  return result;
};

export const changeAccountStatus = async (status, id) => {
  const result = await patch(`admin/account-admin/change-status/${status}/${id}`);
  return result;
};
