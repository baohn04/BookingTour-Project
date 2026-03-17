import { get } from "../utils/request";

export const getSettingGeneral = async () => {
  const result = await get("admin/setting/general");
  return result;
};