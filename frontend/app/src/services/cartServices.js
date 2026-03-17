import { post } from "../utils/request";

export const getListCart = async (cartData) => {
  const result = await post("cart/list-json", cartData);
  return result;
}
