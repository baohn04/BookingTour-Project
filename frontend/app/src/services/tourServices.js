import { get, post } from "../utils/request";

export const getTours = async (slug, queryString = "") => {
  const result = await get(`tours/${slug}?${queryString}`);
  return result;
}

export const getTourDetail = async (slug) => {
  const result = await get(`tours/detail/${slug}`);
  return result;
}

export const getReviews = async (tourId, limit = 2, skip = 0) => {
  const result = await get(`reviews?tourId=${tourId}&limit=${limit}&skip=${skip}`);
  return result;
}

export const postReview = async (data) => {
  const result = await post(`reviews`, data);
  return result;
}

/**
 * Tìm kiếm tour theo keyword, khoảng thời gian, và loại tour.
 * @param {Object} params  
 * @param {string} [params.keyword]
 * @param {string} [params.timeStart] 
 * @param {string} [params.timeEnd]    
 * @param {string} [params.categoryId] 
 * @param {string} [params.sortKey]
 * @param {string} [params.sortValue]
 */

export const searchTours = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "all")
  ).toString();
  const result = await get(`tours/search${qs ? `?${qs}` : ""}`);
  return result;
}
