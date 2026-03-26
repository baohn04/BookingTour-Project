import { useState, useEffect } from 'react';
import { getListCart } from '../services/cartServices';

export const useFetchCart = (cart) => {
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

  return { cartDetails };
};
