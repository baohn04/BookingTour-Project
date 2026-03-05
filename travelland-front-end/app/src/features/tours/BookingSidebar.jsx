import React, { useState } from "react";
import { Button, Typography, Space, Card, message } from "antd";
import { MinusOutlined, PlusOutlined, ThunderboltOutlined } from "@ant-design/icons";
import formatPrice from "../../helpers/formatPrice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateQuantity } from "../../actions/cart";

const { Title, Text } = Typography;

function BookingSidebar(props) {
  const { tourDetail, loading } = props;
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [toddlers, setToddlers] = useState(0);

  //Redux
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer);

  const formattedDate = tourDetail?.timeStart
    ? new Date(tourDetail.timeStart).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Đang cập nhật';

  // Logic giá và tính tổng
  const priceAdult = tourDetail?.price_special ?? tourDetail?.price ?? 11990000;
  const priceChild = priceAdult * 0.8;
  const priceToddler = priceAdult * 0.5;

  const total = adults * priceAdult + children * priceChild + toddlers * priceToddler;

  const stock = tourDetail?.stock ?? 5;

  const handleDecrease = (onChange, value, min = 0) => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrease = (onChange, value) => {
    onChange(value + 1);
  };

  const handleAddToCart = () => {
    if (!tourDetail) return;
    const tourId = tourDetail.id || tourDetail._id;
    const totalQuantity = adults + children + toddlers;

    if (totalQuantity <= 0 || !tourId) return;

    const currentQuantity = { adults, children, toddlers };

    // Kiểm tra item theo id hoặc tourId (giữ tính tương thích)
    if (cart.some(item => item.id === tourId || item.tourId === tourId)) {
      dispatch(updateQuantity(tourId, currentQuantity));
    } else {
      dispatch(addToCart(tourId, currentQuantity));
    }

    // Hiển thị message thông báo
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
        {/* Người lớn */}
        <div className="bg-background border-b border-gray-100 pb-4 flex justify-between items-center w-full">
          <div className="flex flex-col w-[130px]">
            <Text className="text-[15px] font-medium text-text1 block leading-tight">Người lớn</Text>
            <Text type="secondary" className="text-[13px] mt-0.5 block">
              &gt; 10 tuổi
            </Text>
          </div>
          <div className="flex-1 text-left px-2">
            <Text className="text-text1 font-bold text-[15px]">
              {formatPrice(priceAdult)}
            </Text>
          </div>
          <Space size={10} align="center">
            <Button
              type="default"
              shape="circle"
              onClick={() => handleDecrease(setAdults, adults, 1)}
              icon={<MinusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
            <Text className="text-[16px] font-semibold text-text1 w-[20px] text-center">
              {adults}
            </Text>
            <Button
              type="default"
              shape="circle"
              onClick={() => handleIncrease(setAdults, adults)}
              icon={<PlusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
          </Space>
        </div>

        {/* Trẻ em */}
        <div className="bg-background border-b border-gray-100 pb-4 flex justify-between items-center w-full">
          <div className="flex flex-col flex-1 w-[130px]">
            <Text className="text-[15px] font-medium text-text1 block leading-tight">Trẻ em</Text>
            <Text type="secondary" className="text-[13px] mt-0.5 block">
              2 - 10 tuổi
            </Text>
          </div>
          <div className="flex-1 text-left px-2">
            <Text className="text-text1 font-bold text-[15px]">
              {formatPrice(priceChild)}
            </Text>
          </div>
          <Space size={10} align="center">
            <Button
              type="default"
              shape="circle"
              onClick={() => handleDecrease(setChildren, children)}
              icon={<MinusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
            <Text className="text-[16px] font-semibold text-text1 w-[20px] text-center">
              {children}
            </Text>
            <Button
              type="default"
              shape="circle"
              onClick={() => handleIncrease(setChildren, children)}
              icon={<PlusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
          </Space>
        </div>

        {/* Trẻ nhỏ */}
        <div className="bg-background flex justify-between items-center w-full">
          <div className="flex flex-col flex-1 w-[130px]">
            <Text className="text-[15px] font-medium text-text1 block leading-tight">Trẻ nhỏ</Text>
            <Text type="secondary" className="text-[13px] mt-0.5 block">
              &lt; 2 tuổi
            </Text>
          </div>
          <div className="flex-1 text-left px-2">
            <Text className="text-text1 font-bold text-[15px]">
              {formatPrice(priceToddler)}
            </Text>
          </div>
          <Space size={10} align="center">
            <Button
              type="default"
              shape="circle"
              onClick={() => handleDecrease(setToddlers, toddlers)}
              icon={<MinusOutlined className="text-[14px]" />}
              className="text-gray-400 border-gray-200 bg-white hover:!border-primary hover:!text-primary"
            />
            <Text className="text-[16px] font-semibold text-text1 w-[20px] text-center">
              {toddlers}
            </Text>
            <Button
              type="default"
              shape="circle"
              onClick={() => handleIncrease(setToddlers, toddlers)}
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
          {formatPrice(total)}
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
