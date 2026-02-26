import React from 'react';
import { Button } from 'antd';
import { CalendarOutlined, NumberOutlined, EnvironmentOutlined, HistoryOutlined, TeamOutlined } from '@ant-design/icons';
import formatPrice from '../../helpers/formatPrice';
import { Link } from 'react-router-dom';


function TourCard({ tour }) {
  if (!tour) return null;
  const { title, code, images, price, discount, price_special, information, timeStart, stock, slug } = tour;
  const tourImage = images[0];

  const formattedDate = timeStart ? new Date(timeStart).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Đang cập nhật';

  return (
    <div className="border rounded-2xl p-[18px] bg-background mb-6 flex flex-col xl:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow font-sans">

      {/* Image Box */}
      <div className="relative w-full xl:w-[280px] shrink-0 h-[220px] rounded-xl overflow-hidden">
        <img
          src={tourImage}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-text2 text-[12px] font-bold bg-red-500">
            Giảm {discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col py-1">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-text1 text-[13px] font-medium uppercase tracking-wide flex items-center gap-1">
            <NumberOutlined className="text-primary" /> {code || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text1 font-bold text-[14px]">4.8</span>
            <span className="text-text1 text-[14px]">(269)</span>
          </div>
        </div>

        <h3 className="text-text1 font-bold text-[18px] leading-tight mb-3 hover:text-primary cursor-pointer transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-text1/70 text-[14px] mb-4 line-clamp-2 leading-relaxed max-w-[90%]">
          {information || 'Chưa có thông tin cho tour này.'}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 text-text1 text-[13px] font-medium">
          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
            <EnvironmentOutlined className="text-primary" /> Khởi hành: Hà Nội
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
            <HistoryOutlined className="text-primary" /> Thời gian: 5N4Đ
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
            <CalendarOutlined className="text-primary" /> Ngày đi: {formattedDate}
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
            <TeamOutlined className="text-primary" /> Số chỗ còn: {stock || 0}
          </span>
        </div>
      </div>

      <div className="hidden xl:block w-px bg-background my-2"></div>
      <div className="block xl:hidden h-px bg-background"></div>

      <div className="xl:w-[160px] shrink-0 flex flex-col justify-end py-1 text-center xl:text-right">
        <div className="flex flex-col items-center xl:items-end mb-4">
          {discount > 0 ? (
            <>
              <div className="text-text1 line-through text-[14px] mb-0.5">{formatPrice(price)}</div>
              <div className="text-text1 text-[13px] uppercase">
                Chỉ còn <span className="font-bold text-[22px] text-primary normal-case tracking-tight ml-1">{formatPrice(price_special)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-transparent line-through text-[14px] mb-0.5">-</div>
              <div className="text-text1 text-[13px] uppercase">
                Giá từ <span className="font-bold text-[22px] text-primary normal-case tracking-tight ml-1">{formatPrice(price)}</span>
              </div>
            </>
          )}
        </div>

        <Link to={`/tours/detail/${slug}`}>
          <Button
            type="default"
            className="w-full h-11 border-primary text-primary hover:!bg-primary hover:!text-text2 hover:!border-primary rounded-lg font-semibold text-[14px] transition-colors"
          >
            Xem chi tiết
          </Button>
        </Link>
      </div>

    </div>
  );
}

export default TourCard;
