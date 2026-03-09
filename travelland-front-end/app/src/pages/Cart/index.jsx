import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CartList from "./CartList";
import { clearCart } from "../../actions/cart";
import { getListCart } from "../../services/cartServices";
import { Spin, Button } from "antd";

function Cart() {
  const cart = useSelector((state) => state.cartReducer);
  const dispatch = useDispatch();

  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await getListCart(cart);

        if (response && response.data) {
          const infoCart = response.data.map(item => {
            return {
              ...item,
              id: item.tourId,
              quantity: item.quantity
            };
          });

          setCartDetails(infoCart);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin tour giỏ hàng:", error);
      }
    };

    if (cart.length > 0) {
      fetchApi();
    } else {
      setCartDetails([]);
    }
  }, [cart]);

  const total = cartDetails.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0);

  const handleClearCart = () => {
    dispatch(clearCart());
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 font-sans bg-background">
      <h1 className="text-3xl font-extrabold text-text1 mb-6">Giỏ hàng của bạn</h1>

      {cart.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CartList items={cartDetails} />

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-lg p-6">
            <Button
              danger
              size="large"
              onClick={handleClearCart}
              className="font-semibold px-6 mb-4 sm:mb-0"
            >
              Xóa tất cả
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-text1">Tổng tiền:</span>
              <span className="text-3xl font-extrabold text-primary">
                {total.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-gray-50 border border-gray-200 rounded-2xl py-12 px-4 shadow-sm">
          <h2 className="text-2xl font-bold text-text1 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6 font-medium text-[16px]">Bạn chưa thêm bất kỳ tour nào vào giỏ hàng.</p>
          <Button
            type="primary"
            size="large"
            className="bg-primary hover:!bg-primary-hover font-bold px-8 h-12 rounded-lg text-white transition-colors"
            href="/tours"
          >
            Khám phá các Tour ngay
          </Button>
        </div>
      )}
    </div>
  );
}

export default Cart;
