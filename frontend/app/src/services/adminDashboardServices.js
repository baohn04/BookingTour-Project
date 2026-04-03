import { get } from "../utils/request";

export const getDashboardData = async () => {
  const result = await get(`admin/dashboard`);
  return result;
};
