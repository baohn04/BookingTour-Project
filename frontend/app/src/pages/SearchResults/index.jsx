import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Breadcrumb, Typography, Tag, Result } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import BoxListTour from '../../components/BoxListTour';
import SearchBoxTour from '../../components/SearchBoxTour';
import { useSearchTours } from '../../hooks/useSearchTours';
import { useFetchHomeInfo } from '../../hooks/useFetchHomeInfo';

const { Title, Text } = Typography;

function SearchResults() {
  const [searchParams] = useSearchParams();
  const { categories } = useFetchHomeInfo();

  // Đọc params từ URL
  const params = useMemo(() => ({
    keyword: searchParams.get('keyword') || '',
    timeStart: searchParams.get('timeStart') || '',
    timeEnd: searchParams.get('timeEnd') || '',
    categoryId: searchParams.get('categoryId') || 'all',
  }), [searchParams]);

  const { loading, tours, total } = useSearchTours(params);

  // Tìm tên category được chọn để hiển thị tag
  const selectedCategory = useMemo(() => {
    if (!params.categoryId || params.categoryId === 'all') return null;
    return categories.find(c => c._id === params.categoryId);
  }, [params.categoryId, categories]);

  const hasAnyFilter = params.keyword || params.timeStart || params.timeEnd || (params.categoryId && params.categoryId !== 'all');

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 bg-background font-sans">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: 'Kết quả tìm kiếm' },
          ]}
        />
      </div>

      {/* Search box (hiển thị lại với giá trị hiện tại) */}
      <div className="mb-10">
        <SearchBoxTour categories={categories} initialValues={params} />
      </div>

      {/* Header kết quả */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Title level={2} className="!text-text1 !text-2xl md:!text-[28px] !font-bold !m-0 tracking-tight">
          <SearchOutlined className="text-primary mr-2" />
          Kết quả tìm kiếm
        </Title>

        {!loading && hasAnyFilter && (
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <FilterOutlined className="text-text1" />
            {params.keyword && (
              <Tag color="orange" className="!text-sm !rounded-full !px-3 !py-1">
                Từ khóa: <strong>{params.keyword}</strong>
              </Tag>
            )}
            {selectedCategory && (
              <Tag color="blue" className="!text-sm !rounded-full !px-3 !py-1">
                Loại: <strong>{selectedCategory.title}</strong>
              </Tag>
            )}
            {params.timeStart && (
              <Tag color="green" className="!text-sm !rounded-full !px-3 !py-1">
                Từ: <strong>{new Date(params.timeStart).toLocaleDateString('vi-VN')}</strong>
              </Tag>
            )}
            {params.timeEnd && (
              <Tag color="green" className="!text-sm !rounded-full !px-3 !py-1">
                Đến: <strong>{new Date(params.timeEnd).toLocaleDateString('vi-VN')}</strong>
              </Tag>
            )}
          </div>
        )}
      </div>

      {/* Số lượng kết quả */}
      {!loading && hasAnyFilter && (
        <div className="mb-6">
          <Text className="!text-text1 !text-base">
            Tìm thấy <strong className="text-primary">{total}</strong> tour phù hợp
          </Text>
        </div>
      )}

      {/* Nội dung */}
      {!hasAnyFilter ? (
        <Result
          icon={<SearchOutlined style={{ color: 'var(--color-primary)', fontSize: 64 }} />}
          title="Nhập thông tin tìm kiếm"
          subTitle="Vui lòng điền ít nhất một thông tin vào ô tìm kiếm phía trên để tìm tour phù hợp với bạn."
        />
      ) : (
        <BoxListTour tours={tours} loading={loading} />
      )}
    </div>
  );
}

export default SearchResults;
