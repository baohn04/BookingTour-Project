import { get } from "../utils/request";

export const getHomePage = async () => {
  const result = await get("home");
  return result;
}