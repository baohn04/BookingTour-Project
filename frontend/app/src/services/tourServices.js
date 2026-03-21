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
