import React from 'react';
import { Select, Pagination } from 'antd';
import TourCard from './TourCard';

function TourList(props) {
  const { tours } = props;

  const mockTours = [
    { id: 1, badgeText: "20 % OFF", badgeColor: "bg-[var(--color-primary)]", imageSrc: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800" },
    { id: 2, badgeText: null, badgeColor: null, imageSrc: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&q=80&w=800" },
    { id: 3, badgeText: "FEATURED", badgeColor: "bg-[var(--color-text1)]", imageSrc: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?auto=format&fit=crop&q=80&w=800" },
    { id: 4, badgeText: null, badgeColor: null, imageSrc: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" },
    { id: 5, badgeText: null, badgeColor: null, imageSrc: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" },
  ];

  return (
    <div className="w-full font-sans">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="text-text1/70 font-medium text-[15px]">
          1362 results
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text1/70 text-[14px]">Sort by:</span>
          <Select
            defaultValue="featured"
            bordered={false}
            className="font-medium text-text1 min-w-[100px]"
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
            ]}
          />
        </div>
      </div>

      {/* List */}
      <div>
        {mockTours.map((tour) => (
          <TourCard
            key={tour.id}
            badgeText={tour.badgeText}
            badgeColor={tour.badgeColor}
            imageSrc={tour.imageSrc}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12 mb-8">
        <Pagination
          defaultCurrent={1}
          total={1415}
          pageSize={30}
          showSizeChanger={false}
          showTotal={(total, range) => `Showing results ${range[0]}-${range[1]} of ${total.toLocaleString()}`}
          className="flex flex-wrap justify-center [&_.ant-pagination-total-text]:w-full [&_.ant-pagination-total-text]:text-center [&_.ant-pagination-total-text]:order-last [&_.ant-pagination-total-text]:!ml-0 [&_.ant-pagination-total-text]:!mr-0 [&_.ant-pagination-total-text]:mt-8 [&_.ant-pagination-total-text]:text-text1/70 [&_.ant-pagination-total-text]:text-[13px]"
        />
      </div>
    </div>
  );
}

export default TourList;
