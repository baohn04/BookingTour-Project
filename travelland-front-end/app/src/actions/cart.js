export const addToCart = (id, quantity) => {
  return {
    type: "ADD_TO_CART",
    id: id,
    quantity: quantity
  }
}

export const updateQuantity = (id, quantity) => {
  return {
    type: "UPDATE_QUANTITY",
    id: id,
    quantity: quantity
  }
}

export const removeFromCart = (id) => {
  return {
    type: "REMOVE_FROM_CART",
    id: id
  }
}

export const clearCart = () => {
  return {
    type: "CLEAR_CART"
  }
}
