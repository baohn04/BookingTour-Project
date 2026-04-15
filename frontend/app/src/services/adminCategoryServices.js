import { get, patch, postForm, patchForm, del } from "../utils/request";

export const getAdminCategories = async (queryString = "") => {
  const result = await get(`admin/categories${queryString ? `?${queryString}` : ''}`);
  return result;
};

export const changeCategoryStatus = async (status, id) => {
  const result = await patch(`admin/categories/change-status/${status}/${id}`);
  return result;
};

export const createAdminCategory = async (formData) => {
  const result = await postForm(`admin/categories/create`, formData);
  return result;
};

export const getAdminEditCategory = async (id) => {
  const result = await get(`admin/categories/edit/${id}`);
  return result;
};

export const editAdminCategory = async (id, formData) => {
  const result = await patchForm(`admin/categories/edit/${id}`, formData);
  return result;
};

export const deleteAdminCategory = async (id) => {
  const result = await del(`admin/categories/delete/${id}`);
  return result;
};

export const getAdminDetailCategory = async (id) => {
  const result = await get(`admin/categories/detail/${id}`);
  return result;
};
