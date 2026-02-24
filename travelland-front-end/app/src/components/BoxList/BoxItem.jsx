import React from 'react';
import { Typography, Tag, Button } from 'antd';
import { HeartOutlined, HeartFilled, ClockCircleOutlined, NumberOutlined, CalendarOutlined, FireOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

function BoxItem(props) {
  const { item, onFavoriteClick } = props;
  const { title, code, image, images, price, discount, price_special, information, timeStart, stock, isFavorite } = item;
  const tourImage = image || (images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3");

  const formatPrice = (val) => {
    if (!val && val !== 0) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const formattedDate = timeStart ? new Date(timeStart).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Đang cập nhật';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col relative">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
          Giảm {discount}%
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden m-2 rounded-xl">
        <img
          src={tourImage}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {/* Favorite Button */}
        <button
          onClick={onFavoriteClick}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors cursor-pointer border-none"
        >
          {isFavorite ? (
            <HeartFilled className="text-red-500 text-lg" />
          ) : (
            <HeartOutlined className="text-gray-400 text-lg hover:text-red-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pt-2 pb-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <Text className="text-gray-400 text-xs uppercase font-medium tracking-wide flex items-center gap-1">
            <NumberOutlined /> {code || 'N/A'}
          </Text>
          {stock && stock <= 5 ? <Tag color="error" className="m-0 !text-[10px]"><FireOutlined /> Sắp hết</Tag> : null}
        </div>

        <Title level={5} className="!text-[var(--color-text1)] !mb-2 !font-bold line-clamp-2 min-h-[48px]" title={title}>
          {title}
        </Title>

        <Text className="text-gray-500 text-sm line-clamp-2 min-h-[42px] mb-3" title={information}>
          {information || 'Chưa có thông tin'}
        </Text>

        <div className="flex flex-col gap-1 mb-4 mt-auto">
          <Text className="text-gray-500 text-xs flex items-center gap-2">
            <CalendarOutlined className="text-primary" /> Khởi hành: <span className="font-medium text-gray-700">{formattedDate}</span>
          </Text>
          <Text className="text-gray-500 text-xs flex items-center gap-2">
            <ClockCircleOutlined className="text-primary" /> Còn chỗ: <span className="font-medium text-gray-700">{stock || 0} vé</span>
          </Text>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-end">
          <Button
            type="primary"
            className="!h-10 !px-6 !rounded-full !bg-primary hover:!bg-primary-hover !text-white !font-bold !border-none !shadow-md hover:!shadow-primary/30"
          >
            Đặt ngay
          </Button>

          <div className="flex flex-col">
            {discount > 0 ? (
              <>
                <Text className="text-gray-400 text-xs line-through mb-0.5">
                  {formatPrice(price)}
                </Text>
                <Text className="!text-primary text-lg font-bold leading-none">
                  {formatPrice(price_special)}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-transparent text-xs select-none mb-0.5">-</Text>
                <Text className="!text-primary text-lg font-bold leading-none">
                  {formatPrice(price)}
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoxItem;
