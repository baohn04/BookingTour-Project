import { get } from "../utils/request";

export const getTours = async (slug, queryString = "") => {
  const result = await get(`tours/${slug}?${queryString}`);
  return result;
}

export const getTourDetail = async (slug) => {
  const result = await get(`tours/detail/${slug}`);
  return result;
}