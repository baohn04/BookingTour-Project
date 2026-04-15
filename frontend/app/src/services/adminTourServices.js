import { get, patch, postForm, patchForm, del } from "../utils/request";

export const getAdminTours = async (queryString = "") => {
  const result = await get(`admin/tours${queryString ? `?${queryString}` : ''}`);
  return result;
};

export const changeTourStatus = async (status, id) => {
  const result = await patch(`admin/tours/change-status/${status}/${id}`);
  return result;
};

export const getAdminCreateTour = async () => {
  const result = await get(`admin/tours/create`);
  return result;
};

export const createAdminTour = async (formData) => {
  const result = await postForm(`admin/tours/create`, formData);
  return result;
};

export const getAdminEditTour = async (id) => {
  const result = await get(`admin/tours/edit/${id}`);
  return result;
};

export const editAdminTour = async (id, formData) => {
  const result = await patchForm(`admin/tours/edit/${id}`, formData);
  return result;
};

export const deleteAdminTour = async (id) => {
  const result = await del(`admin/tours/delete/${id}`);
  return result;
};

export const getAdminDetailTour = async (id) => {
  const result = await get(`admin/tours/detail/${id}`);
  return result;
};

