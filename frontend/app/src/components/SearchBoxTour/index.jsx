import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Input, DatePicker, Select, Button } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, FlagOutlined, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function SearchBoxTour(props) {
  const { categories = [], initialValues = {} } = props;
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState(initialValues.keyword || '');
  const [dateRange, setDateRange] = useState(() => {
    const start = initialValues.timeStart ? dayjs(initialValues.timeStart) : null;
    const end = initialValues.timeEnd ? dayjs(initialValues.timeEnd) : null;
    return start || end ? [start, end] : null;
  });
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || 'all');

  // Đồng bộ khi initialValues thay đổi (ví dụ: user thay URL thủ công)
  useEffect(() => {
    setKeyword(initialValues.keyword || '');
    setCategoryId(initialValues.categoryId || 'all');
    const start = initialValues.timeStart ? dayjs(initialValues.timeStart) : null;
    const end = initialValues.timeEnd ? dayjs(initialValues.timeEnd) : null;
    setDateRange(start || end ? [start, end] : null);
  }, [initialValues.keyword, initialValues.timeStart, initialValues.timeEnd, initialValues.categoryId]);

  const handleSearch = () => {
    // Build URLSearchParams từ state
    const params = new URLSearchParams();

    if (keyword.trim()) params.set('keyword', keyword.trim());

    if (dateRange && dateRange[0]) {
      params.set('timeStart', dateRange[0].startOf('day').toISOString());
    }
    if (dateRange && dateRange[1]) {
      params.set('timeEnd', dateRange[1].endOf('day').toISOString());
    }

    if (categoryId && categoryId !== 'all') {
      params.set('categoryId', categoryId);
    }

    navigate(`/tours/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="bg-background rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full max-w-[1200px] relative mx-auto">
      <Row gutter={[24, 16]} align="middle">
        {/* Tour name */}
        <Col xs={24} md={8} lg={7}>
          <div className="flex flex-col h-full justify-center px-3">
            <span className="text-base font-semibold text-text1 mb-2 block">Tên tour</span>
            <div className="flex items-center bg-background rounded-xl px-4 py-3 transition-all border border-transparent hover:border-primary focus-within:border-primary focus-within:shadow-sm">
              <EnvironmentOutlined className="text-xl text-text1 mr-3" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tên tour"
                variant="borderless"
                className="!p-0 !bg-transparent text-[15px] w-full text-text1 font-medium placeholder:text-text1"
              />
            </div>
          </div>
        </Col>

        {/* When - Date Range */}
        <Col xs={24} md={8} lg={7}>
          <div className="flex flex-col h-full justify-center px-3">
            <span className="text-base font-semibold text-text1 mb-2 block">Thời gian</span>
            <div className="flex items-center bg-background rounded-xl px-4 py-3 transition-all border border-transparent hover:border-primary focus-within:border-primary focus-within:shadow-sm">
              <CalendarOutlined className="text-xl text-text1 mr-3" />
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
                variant="borderless"
                suffixIcon={null}
                className="!p-0 !bg-transparent w-full text-[15px] font-medium"
                placeholder={['Ngày đi', 'Ngày về']}
                format="DD/MM/YYYY"
                separator={<span className="text-text1 mx-1">~</span>}
              />
            </div>
          </div>
        </Col>

        {/* Tour Type */}
        <Col xs={24} md={8} lg={6}>
          <div className="flex flex-col h-full justify-center px-3">
            <span className="text-base font-semibold text-text1 mb-2 block">Loại tour</span>
            <div className="flex items-center bg-background rounded-xl px-4 py-3 transition-all border border-transparent hover:border-primary focus-within:border-primary focus-within:shadow-sm">
              <FlagOutlined className="text-xl text-text1 mr-3" />
              <Select
                value={categoryId}
                onChange={(val) => setCategoryId(val)}
                variant="borderless"
                className="flex-1 !ml-[-11px] w-[calc(100%+11px)] text-[15px] font-medium"
                styles={{ popup: { root: { borderRadius: '12px', padding: '8px' } } }}
                options={[
                  { value: 'all', label: 'Tất cả loại tour' },
                  ...categories.map((item) => ({
                    value: item._id,
                    label: item.title
                  }))
                ]}
              />
            </div>
          </div>
        </Col>

        {/* Search Button */}
        <Col xs={24} md={24} lg={4}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="w-full !h-14 !rounded-xl !text-base !font-semibold !bg-gradient-to-br !from-primary !to-primary-hover !border-none !shadow-[0_4px_12px_rgb(var(--color-primary)/0.3)] mt-7 flex items-center justify-center hover:!from-primary-hover hover:!to-primary"
          >
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default SearchBoxTour;
