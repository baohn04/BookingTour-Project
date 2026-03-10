import { post } from "../utils/request";

export const postOrder = async (data) => {
  const result = await post("order", data);
  return result;
};
