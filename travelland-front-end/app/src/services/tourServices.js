import { get } from "../utils/request";

export const getTours = async (slug) => {
  const result = await get(`tours/${slug}`);
  return result;
}