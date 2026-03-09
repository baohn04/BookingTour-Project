const initCart = (() => {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    return [];
  }
})();

const cartReducer = (state = initCart, action) => {
  let newState;
  switch (action.type) {
    case "ADD_TO_CART": {
      newState = [
        ...state,
        {
          tourId: action.id,
          quantity: action.quantity
        }
      ];
      break;
    }
    case "UPDATE_QUANTITY": {
      newState = state.map(item => {
        if (item.tourId === action.id) {
          return {
            ...item,
            quantity: action.absolute ? action.quantity : item.quantity + action.quantity
          };
        }
        return item;
      });
      break;
    }
    case "REMOVE_FROM_CART": {
      newState = state.filter(item => item.tourId !== action.id);
      break;
    }
    case "CLEAR_CART": {
      newState = [];
      break;
    }
    default:
      return state;
  }

  // Cập nhật lại localStorage
  if (newState) {
    localStorage.setItem("cart", JSON.stringify(newState));
    window.dispatchEvent(new Event("cartUpdated"));
    return newState;
  }
  return state;
};

export default cartReducer;