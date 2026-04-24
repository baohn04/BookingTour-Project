import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import accountReducer from "./accountReducer";

const rootReducers = combineReducers({
  cart: cartReducer,
  account: accountReducer
});

export default rootReducers;
