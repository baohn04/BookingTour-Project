import { get } from "../utils/request";

export const getTours = async (slug, queryString = "") => {
  const result = await get(`tours/${slug}?${queryString}`);
  return result;
}