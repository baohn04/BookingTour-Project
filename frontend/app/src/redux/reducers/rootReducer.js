import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import accountReducer from "./accountReducer";

const allReducers = combineReducers({
  cart: cartReducer,
  account: accountReducer
});

export default allReducers;
