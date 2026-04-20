import { get, post, patch, del } from '../utils/request';

export const getAdminRoles = async () => {
  const result = await get('admin/roles');
  return result;
};

export const createAdminRole = async (options) => {
  const result = await post('admin/roles/create', options);
  return result;
};

export const getAdminRoleEdit = async (id) => {
  const result = await get(`admin/roles/edit/${id}`);
  return result;
};

export const editAdminRole = async (id, options) => {
  const result = await patch(`admin/roles/edit/${id}`, options);
  return result;
};

export const deleteAdminRole = async (id) => {
  const result = await del(`admin/roles/delete/${id}`);
  return result;
};

export const updatePermissions = async (options) => {
  const result = await patch('admin/roles/permissions', options);
  return result;
};
