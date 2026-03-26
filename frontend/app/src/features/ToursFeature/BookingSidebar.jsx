import React, { useState } from "react";
import { Button, Typography, Space, Card, message } from "antd";
import { MinusOutlined, PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import formatPriceHelper from "../../helpers/formatPriceHelper";
import formatDateHelper from "../../helpers/formatDateHelper";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../../actions/cartAction";

const { Title, Text } = Typography;

function BookingSidebar(props) {
  const { tourDetail, loading } = props;
  const [quantity, setQuantity] = useState(1);

  //Redux
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer);

  const formattedDate = formatDateHelper(tourDetail?.timeStart);

  // Logic giá và tính tổng (quy về 1 giá chung: price_special hoặc price)
  const price = tourDetail?.price_special ?? tourDetail?.price ?? undefined;
  const total = quantity * price;
  const stock = tourDetail?.stock ?? 5;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!tourDetail) return;
    const tourId = tourDetail.id || tourDetail._id;

    if (quantity <= 0 || !tourId) return;

    // Kiểm tra item theo id hoặc tourId
    if (cart.some(item => item.id === tourId || item.tourId === tourId)) {
      // updateQuantity ở đây là tăng thêm quantity vé chớ không phải gán cứng
      dispatch(updateQuantity(tourId, quantity));
    } else {
      dispatch(addToCart(tourId, quantity));
    }

    message.success("Thêm vào giỏ hàng thành công!");
  }

  return (
    <Card
      className="sticky top-8 w-full shadow-sm font-sans border border-gray-100 rounded-xl bg-background"
      styles={{ body: { padding: "32px 24px" } }}
    >
      <Title level={3} className="text-[20px] font-bold text-text1 mb-2 mt-0 leading-tight">
        {tourDetail?.title || "Lịch Khởi Hành và Giá Tour"}
      </Title>

      <div className="mb-6">
        <Text className="text-[14px] text-gray-500 font-semibold">
          Mã Tour: {tourDetail?.code || "---"}
        </Text>
      </div>

      <div className="mb-3">
        <Text className="text-[16px] text-text1 font-bold">
          Ngày khởi hành: {formattedDate}
        </Text>
      </div>

      <div className="mb-3">
        <Text className="text-[16px] text-text1 font-bold">
          Số lượng vé:
        </Text>
      </div>

      {/* Tickets form Section */}
      <Space direction="vertical" size={16} className="w-full mb-6 pt-2">
        <div className="bg-background border-b border-gray-100 pb-4 flex justify-between items-center w-full">
          <div className="flex flex-col w-[130px]">
            {/* Just generalized label */}
            <Text className="text-[15px] font-medium text-text1 block leading-tight">Vé Tour</Text>
          </div>
          <div className="flex-1 text-left px-2">
            <Text className="text-text1 font-bold text-[15px]">
              {formatPriceHelper(price)}
            </Text>
          </div>
          <Space size={10} align="center">
            <Button
              type="default"
              shape="circle"
              onClick={handleDecrease}
              icon={<MinusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
            <Text className="text-[16px] font-semibold text-text1 w-[20px] text-center">
              {quantity}
            </Text>
            <Button
              type="default"
              shape="circle"
              onClick={handleIncrease}
              icon={<PlusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
          </Space>
        </div>
      </Space>

      {/* Trạng thái chỗ */}
      <Space size={8} align="center" className="mb-6 w-full pt-4">
        <ThunderboltOutlined className="text-primary text-[22px]" />
        <Text className="text-primary text-[16px]">
          Còn <strong className="font-bold">{stock}</strong> chỗ
        </Text>
      </Space>

      {/* Tổng giá */}
      <div className="flex justify-between items-end mb-8 pt-6 border-t border-gray-100">
        <Text className="text-[18px] font-bold text-text1 pb-1">
          Tổng Cộng:
        </Text>
        <Text className="text-[28px] font-bold text-text1 leading-none">
          {formatPriceHelper(total)}
        </Text>
      </div>

      {/* Action Buttons */}
      <Space direction="vertical" size={16} className="w-full">
        <Button
          type="primary"
          size="large"
          onClick={handleAddToCart}
          block
          disabled={loading || !tourDetail}
          className="bg-primary hover:!bg-primary-hover border-none font-bold rounded-xl h-[52px] text-[18px] shadow-sm disabled:opacity-50 text-white transition-colors"
        >
          Thêm vào giỏ hàng
        </Button>
      </Space>
    </Card>
  );
}

export default BookingSidebar;
