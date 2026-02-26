import React from 'react';
import { Typography, Tag, Button } from 'antd';
import { NumberOutlined, CalendarOutlined, FireOutlined, HistoryOutlined, TeamOutlined } from '@ant-design/icons';
import formatPrice from '../../helpers/formatPrice';

const { Text, Title } = Typography;

function BoxItem(props) {
  const { item } = props;
  const { title, code, images, price, discount, price_special, information, timeStart, stock } = item;
  const tourImage = images[0];

  const formattedDate = timeStart ? new Date(timeStart).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Đang cập nhật';

  return (
    <div className="group bg-background rounded-2xl border border-text2 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col relative">
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-red-500 text-text2 px-2 py-1 rounded-md text-xs font-bold shadow-md">
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
      </div>

      {/* Content */}
      <div className="px-4 pt-2 pb-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <Text className="text-text1 text-xs uppercase font-medium tracking-wide flex items-center gap-1">
            <NumberOutlined /> {code || 'N/A'}
          </Text>
          {stock && stock <= 5 ? <Tag color="error" className="m-0 !text-[10px]"><FireOutlined /> Sắp hết</Tag> : null}
        </div>

        <Title level={5} className="text-text1 !mb-2 !font-bold line-clamp-2 min-h-[48px]" title={title}>
          {title}
        </Title>

        <Text className="text-text1 text-sm line-clamp-2 min-h-[42px] mb-3" title={information}>
          {information || 'Chưa có thông tin'}
        </Text>

        <div className="flex flex-col gap-1 mb-4 mt-auto">
          <Text className="text-text1 text-xs flex items-center gap-2">
            <CalendarOutlined className="text-primary" /> Ngày đi: <span className="font-medium text-text1">{formattedDate}</span>
          </Text>
          <Text className="text-text1 text-xs flex items-center gap-2">
            <HistoryOutlined className="text-primary" /> Thời gian: <span className="font-medium text-text1">5N4Đ</span>
          </Text>
          <Text className="text-text1 text-xs flex items-center gap-2">
            <TeamOutlined className="text-primary" /> Số chỗ còn: <span className="font-medium text-text1">{stock || 0}</span>
          </Text>
        </div>

        <div className="border-t pt-4 mt-2 flex justify-between items-end">
          <Button
            type="primary"
            className="!h-10 !px-6 !rounded-full !bg-primary hover:!bg-primary-hover text-text2 !font-bold !border-none !shadow-md hover:!shadow-primary/30"
          >
            Đặt ngay
          </Button>

          <div className="flex flex-col">
            {discount > 0 ? (
              <>
                <Text className="text-text1 text-xs line-through mb-0.5">
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
