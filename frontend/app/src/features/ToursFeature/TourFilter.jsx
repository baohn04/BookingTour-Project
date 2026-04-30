import { useState } from 'react';
import { Button, DatePicker, Select, Tag } from 'antd';
import {
  DollarOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  ReloadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// Các mốc ngân sách tương ứng với trường price trong model
const PRICE_RANGES = [
  { label: 'Dưới 5 triệu', min: 0, max: 5_000_000 },
  { label: '5 - 10 triệu', min: 5_000_000, max: 10_000_000 },
  { label: '10 - 20 triệu', min: 10_000_000, max: 20_000_000 },
  { label: 'Trên 20 triệu', min: 20_000_000, max: undefined },
];

// Danh sách timeTour phổ biến
const TIME_TOUR_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: '1N', label: '1 Ngày' },
  { value: '2N1Đ', label: '2N1Đ' },
  { value: '3N2Đ', label: '3N2Đ' },
  { value: '4N3Đ', label: '4N3Đ' },
  { value: '5N4Đ', label: '5N4Đ' },
  { value: '7N6Đ', label: '7N6Đ' },
];

function TourFilter(props) {
  const { searchParams, setSearchParams } = props;

  const [activePriceKey, setActivePriceKey] = useState(null);   // index trong PRICE_RANGES
  const [startDeparture, setStartDeparture] = useState('all');
  const [endDeparture, setEndDeparture] = useState('all');
  const [dateRange, setDateRange] = useState(null);              // [dayjs, dayjs] | null
  const [timeTour, setTimeTour] = useState('all');

  const hasActiveFilter = activePriceKey !== null
    || startDeparture !== 'all'
    || endDeparture !== 'all'
    || dateRange !== null
    || timeTour !== 'all';

  // ── Áp dụng filter → cập nhật searchParams (trigger fetch lại) ───────────
  const handleApply = () => {
    const newParams = new URLSearchParams(searchParams);

    // Xóa các filter cũ
    ['priceMin', 'priceMax', 'startDeparture', 'endDeparture', 'timeStart', 'timeEnd', 'timeTour'].forEach((k) =>
      newParams.delete(k)
    );

    // Ngân sách
    if (activePriceKey !== null) {
      const { min, max } = PRICE_RANGES[activePriceKey];
      if (min) newParams.set('priceMin', String(min));
      if (max) newParams.set('priceMax', String(max));
    }

    // Điểm khởi hành
    if (startDeparture !== 'all') newParams.set('startDeparture', startDeparture);

    // Điểm đến
    if (endDeparture !== 'all') newParams.set('endDeparture', endDeparture);

    // Khoảng ngày đi
    if (dateRange && dateRange[0]) {
      newParams.set('timeStart', dateRange[0].startOf('day').toISOString());
    }
    if (dateRange && dateRange[1]) {
      newParams.set('timeEnd', dateRange[1].endOf('day').toISOString());
    }

    // Thời gian tour
    if (timeTour !== 'all') newParams.set('timeTour', timeTour);

    setSearchParams(newParams);
  };

  // ── Reset toàn bộ filter ─────────────────────────────────────────────────
  const handleReset = () => {
    setActivePriceKey(null);
    setStartDeparture('all');
    setEndDeparture('all');
    setDateRange(null);
    setTimeTour('all');

    const newParams = new URLSearchParams(searchParams);
    ['priceMin', 'priceMax', 'startDeparture', 'endDeparture', 'timeStart', 'timeEnd', 'timeTour'].forEach((k) =>
      newParams.delete(k)
    );
    setSearchParams(newParams);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-background p-5 flex flex-col gap-6 font-sans shadow-sm">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-text1 font-bold text-[17px]">
          <FilterOutlined className="text-primary" />
          Bộ lọc
        </span>
        {hasActiveFilter && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
          >
            <ReloadOutlined /> Xóa tất cả
          </button>
        )}
      </div>

      {/* ── Ngân sách (price) ────────────────────────────────────────── */}
      <div>
        <h3 className="text-text1 font-bold text-[15px] mb-3 flex items-center gap-2">
          <DollarOutlined className="text-primary" /> Ngân sách
        </h3>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range, index) => (
            <div
              key={index}
              onClick={() => setActivePriceKey(activePriceKey === index ? null : index)}
              className={`border rounded-xl py-2 px-3 text-sm cursor-pointer transition-all select-none
                ${activePriceKey === index
                  ? 'border-primary bg-orange-50 text-primary font-semibold'
                  : 'border-gray-200 text-text1 hover:border-primary hover:text-primary bg-background'
                }`}
            >
              {range.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Điểm khởi hành (startDeparture) ──────────────────────────── */}
      <div>
        <h3 className="text-text1 font-bold text-[15px] mb-3 flex items-center gap-2">
          <EnvironmentOutlined className="text-primary" /> Điểm khởi hành
        </h3>
        <Select
          size="large"
          value={startDeparture}
          onChange={setStartDeparture}
          className="w-full"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Hà Nội', label: 'Hà Nội' },
            { value: 'TP.HCM', label: 'TP. Hồ Chí Minh' },
            { value: 'Đà Nẵng', label: 'Đà Nẵng' },
            { value: 'Nha Trang', label: 'Nha Trang' },
            { value: 'Huế', label: 'Huế' },
            { value: 'Hội An', label: 'Hội An' },
            { value: 'Cần Thơ', label: 'Cần Thơ' },
          ]}
        />
      </div>

      {/* ── Điểm đến (endDeparture) ──────────────────────────────────── */}
      <div>
        <h3 className="text-text1 font-bold text-[15px] mb-3 flex items-center gap-2">
          <EnvironmentOutlined className="text-primary" /> Điểm đến
        </h3>
        <Select
          size="large"
          value={endDeparture}
          onChange={setEndDeparture}
          className="w-full"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Hà Nội', label: 'Hà Nội' },
            { value: 'TP.HCM', label: 'TP. Hồ Chí Minh' },
            { value: 'Đà Nẵng', label: 'Đà Nẵng' },
            { value: 'Nha Trang', label: 'Nha Trang' },
            { value: 'Huế', label: 'Huế' },
            { value: 'Hội An', label: 'Hội An' },
            { value: 'Phú Quốc', label: 'Phú Quốc' },
            { value: 'Sa Pa', label: 'Sa Pa' },
            { value: 'Hạ Long', label: 'Hạ Long' },
          ]}
        />
      </div>

      {/* ── Ngày đi (timeStart range) ─────────────────────────────────── */}
      <div>
        <h3 className="text-text1 font-bold text-[15px] mb-3 flex items-center gap-2">
          <CalendarOutlined className="text-primary" /> Khoảng ngày đi
        </h3>
        <RangePicker
          size="large"
          className="w-full"
          format="DD/MM/YYYY"
          placeholder={['Từ ngày', 'Đến ngày']}
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          disabledDate={(current) => current && current < dayjs().startOf('day')}
        />
      </div>

      {/* ── Thời gian tour (timeTour) ─────────────────────────────────── */}
      <div>
        <h3 className="text-text1 font-bold text-[15px] mb-3 flex items-center gap-2">
          <FieldTimeOutlined className="text-primary" /> Thời gian tour
        </h3>
        <Select
          size="large"
          value={timeTour}
          onChange={setTimeTour}
          className="w-full"
          options={TIME_TOUR_OPTIONS}
        />
      </div>

      {hasActiveFilter && (
        <div className="flex flex-wrap gap-1.5">
          {activePriceKey !== null && (
            <Tag color="orange" closable onClose={() => setActivePriceKey(null)} className="!rounded-full !text-xs">
              {PRICE_RANGES[activePriceKey].label}
            </Tag>
          )}
          {startDeparture !== 'all' && (
            <Tag color="blue" closable onClose={() => setStartDeparture('all')} className="!rounded-full !text-xs">
              Từ: {startDeparture}
            </Tag>
          )}
          {endDeparture !== 'all' && (
            <Tag color="geekblue" closable onClose={() => setEndDeparture('all')} className="!rounded-full !text-xs">
              Đến: {endDeparture}
            </Tag>
          )}
          {dateRange && (
            <Tag color="green" closable onClose={() => setDateRange(null)} className="!rounded-full !text-xs">
              {dateRange[0]?.format('DD/MM')} – {dateRange[1]?.format('DD/MM/YYYY')}
            </Tag>
          )}
          {timeTour !== 'all' && (
            <Tag color="purple" closable onClose={() => setTimeTour('all')} className="!rounded-full !text-xs">
              {timeTour}
            </Tag>
          )}
        </div>
      )}

      <Button
        type="primary"
        size="large"
        onClick={handleApply}
        disabled={!hasActiveFilter}
        className="w-full !h-12 !rounded-xl !text-base !font-semibold !bg-gradient-to-br !from-primary !to-primary-hover !border-none !shadow-[0_4px_12px_rgb(var(--color-primary)/0.3)] flex items-center justify-center hover:!from-primary-hover hover:!to-primary disabled:!opacity-60"
      >
        Áp dụng bộ lọc
      </Button>
    </div>
  );
}

export default TourFilter;
