import React from 'react';
import { Row, Col, Select, Button, DatePicker } from 'antd';

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

function TourFilter() {
  return (
    <div className="w-full rounded-2xl border  bg-background p-5 flex flex-col gap-6 font-sans shadow-sm">

      {/* Ngân sách */}
      <div>
        <h3 className="text-text1 font-bold text-[16px] mb-3">Ngân sách</h3>
        <Row gutter={[12, 12]}>
          {['Dưới 5 triệu', 'Từ 5 - 10 triệu', 'Từ 10 - 20 triệu', 'Trên 20 triệu'].map((item, index) => (
            <Col span={12} key={index}>
              <div className="border  rounded-md py-2 px-2 text-center text-[14px] text-text1 cursor-pointer hover:border-primary hover:text-primary transition-colors bg-background">
                {item}
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Điểm khởi hành */}
      <div>
        <h3 className="text-text1 font-bold text-[16px] mb-3">Điểm khởi hành</h3>
        <Select
          size="large"
          defaultValue="all"
          className="w-full"
          options={[{ value: 'all', label: 'Tất cả' }]}
        />
      </div>

      {/* Điểm đến */}
      <div>
        <h3 className="text-text1 font-bold text-[16px] mb-3">Điểm đến</h3>
        <Select
          size="large"
          defaultValue="quang-ninh"
          className="w-full"
          options={[{ value: 'quang-ninh', label: 'Quảng Ninh' }]}
        />
      </div>

      {/* Ngày đi */}
      <div>
        <h3 className="text-text1 font-bold text-[16px] mb-3">Ngày đi</h3>
        <DatePicker size='large' className='w-full' format="DD/MM/YYYY" onChange={onChange} />
      </div>

      {/* Áp dụng */}
      <Button
        type="primary"
        size="large"
        className="w-full !h-14 !rounded-xl !text-base !font-semibold !bg-gradient-to-br !from-primary !to-primary-hover !border-none !shadow-[0_4px_12px_rgb(var(--color-primary)/0.3)] mt-7 flex items-center justify-center hover:!from-primary-hover hover:!to-primary"
      >
        Áp dụng
      </Button>

    </div>
  );
}

export default TourFilter;
