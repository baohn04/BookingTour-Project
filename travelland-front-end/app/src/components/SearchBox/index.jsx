import { Row, Col, Input, DatePicker, Select, Button } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, FlagOutlined, SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

function SearchBox(props) {
  const { categories } = props;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] w-full max-w-[1200px] relative mx-auto">
      <Row gutter={[24, 16]} align="middle">
        {/* Tour name */}
        <Col xs={24} md={8} lg={7}>
          <div className="flex flex-col h-full justify-center px-3">
            <span className="text-base font-semibold text-gray-800 mb-2 block">Tên tour</span>
            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 transition-all border border-transparent hover:border-primary focus-within:border-primary focus-within:shadow-sm">
              <EnvironmentOutlined className="text-xl text-gray-400 mr-3" />
              <Input
                placeholder="Nhập tên tour"
                bordered={false}
                className="!p-0 !bg-transparent text-[15px] w-full text-gray-700 font-medium placeholder:text-gray-400"
              />
            </div>
          </div>
        </Col>

        {/* When - Date Range */}
        <Col xs={24} md={8} lg={7}>
          <div className="flex flex-col h-full justify-center px-3">
            <span className="text-base font-semibold text-gray-800 mb-2 block">Thời gian</span>
            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 transition-all border border-transparent hover:border-primary focus-within:border-primary focus-within:shadow-sm">
              <CalendarOutlined className="text-xl text-gray-400 mr-3" />
              <RangePicker
                bordered={false}
                suffixIcon={null}
                className="!p-0 !bg-transparent w-full text-[15px] font-medium"
                placeholder={['Ngày đi', 'Ngày về']}
                format="DD/MM/YYYY"
                separator={<span className="text-gray-400 mx-1">~</span>}
              />
            </div>
          </div>
        </Col>

        {/* Tour Type */}
        <Col xs={24} md={8} lg={6}>
          <div className="flex flex-col h-full justify-center px-3">
            <span className="text-base font-semibold text-gray-800 mb-2 block">Loại tour</span>
            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 transition-all border border-transparent hover:border-primary focus-within:border-primary focus-within:shadow-sm">
              <FlagOutlined className="text-xl text-gray-400 mr-3" />

              <Select
                defaultValue="all"
                bordered={false}
                className="flex-1 !ml-[-11px] w-[calc(100%+11px)] text-[15px] font-medium"
                dropdownStyle={{ borderRadius: '12px', padding: '8px' }}
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
            className="w-full !h-14 !rounded-xl !text-base !font-semibold !bg-gradient-to-br !from-primary !to-primary-hover !border-none !shadow-[0_4px_12px_rgb(var(--color-primary)/0.3)] mt-7 flex items-center justify-center hover:!from-primary-hover hover:!to-primary"
          >
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default SearchBox;
