import React from 'react';
import { Select, Skeleton } from 'antd';
import TourCard from './TourCard';

function TourList(props) {
  const { tours, loading, onSortChange, currentSort } = props;

  return (
    <div className="w-full font-sans">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="text-text1/70 font-medium text-[15px]">
          Chúng tôi tìm thấy {tours?.length || 0} chương trình tour cho quý khách
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text1/70 text-[14px]">Sắp xếp theo:</span>
          <Select
            value={currentSort || "all"}
            onChange={onSortChange}
            bordered={false}
            className="font-medium text-text1 min-w-[100px]"
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'price_desc', label: 'Giá từ cao đến thấp' },
              { value: 'price_asc', label: 'Giá từ thấp đến cao' },
              { value: 'time_start_asc', label: 'Ngày khởi hành gần nhất' },
            ]}
          />
        </div>
      </div>

      {/* List */}
      <div>
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border rounded-2xl p-[18px] bg-background mb-6 flex flex-col xl:flex-row gap-6 shadow-sm">
              <Skeleton.Image active className="!w-full xl:!w-[280px] !h-[220px] rounded-xl shrink-0" />
              <div className="flex-1 flex flex-col py-2">
                <Skeleton active paragraph={{ rows: 4 }} title={{ width: '80%' }} />
              </div>
              <div className="hidden xl:block w-px bg-background my-2"></div>
              <div className="xl:w-[160px] shrink-0 flex flex-col justify-end">
                <Skeleton.Button active block className="!h-11 mt-4" shape="round" />
              </div>
            </div>
          ))
        ) : tours && tours.length > 0 ? (
          tours.map((tour) => (
            <TourCard
              key={tour._id}
              tour={tour}
            />
          ))
        ) : (
          <div className="text-center py-12 text-text1/70 w-full border border-dashed rounded-2xl">
            Không tìm thấy tour du lịch nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default TourList;
