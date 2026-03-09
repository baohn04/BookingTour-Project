import CartItem from "./CartItem";

function CartList({ items }) {
  return (
    <div className="cart">
      <CartItem items={items} />
    </div>
  )
}

export default CartList;