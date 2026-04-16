import CartItem from "./CartItem";

function CartList(props) {
  const { items } = props;

  return (
    <div className="cart">
      <CartItem items={items} />
    </div>
  )
}

export default CartList;