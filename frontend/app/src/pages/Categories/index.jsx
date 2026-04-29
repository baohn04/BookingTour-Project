import React, { useMemo } from 'react';
import { Typography, Breadcrumb, Row, Col, Card, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { AppstoreOutlined, FireOutlined } from '@ant-design/icons';
import { useFetchHomeInfo } from '../../hooks/useFetchHomeInfo';
import BoxListTour from '../../components/BoxListTour';

const { Title, Text } = Typography;

function Categories() {
  const { loading, categories, featuredTours } = useFetchHomeInfo();

  // Chọn ngẫu nhiên 5 tour từ danh sách featuredTours để hiển thị gợi ý
  const randomTours = useMemo(() => {
    if (!featuredTours || featuredTours.length === 0) return [];
    const shuffled = [...featuredTours].sort(() => 0.4 - Math.random());
    return shuffled.slice(0, 4);
  }, [featuredTours]);

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 font-sans bg-background">
      <div className="mb-8">
        <Breadcrumb
          items={[
            { title: <Link to="/">Trang chủ</Link> },
            { title: 'Loại Tour' },
          ]}
        />
      </div>

      <div className="mb-16">
        <Title level={2} className="text-text1 !text-3xl md:!text-4xl !font-bold !mb-8">
          <AppstoreOutlined className="text-primary mr-3" />
          Danh Mục Tour Du Lịch
        </Title>

        <Row gutter={[24, 24]}>
          {loading ? (
            // Skeleton cho categories
            [...Array(8)].map((_, i) => (
              <Col xs={24} sm={12} md={8} lg={6} key={i}>
                <Card className="rounded-2xl border-none shadow-sm h-[200px]">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))
          ) : (
            categories && categories.map((category) => (
              <Col xs={24} sm={12} md={8} lg={6} key={category._id || category.id}>
                <Link to={`/tours/${category.slug}`} className="block h-full group hover:no-underline">
                  <div className="bg-background border border-gray-100 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/30 group-hover:-translate-y-1">
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Category'; }}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
                    </div>
                    <div className="p-5 text-center">
                      <Title level={5} className="!mb-1 text-text1 group-hover:!text-primary transition-colors">
                        {category.title}
                      </Title>
                      <Text className="text-gray-500 text-xs font-medium uppercase tracking-wider">Khám phá ngay</Text>
                    </div>
                  </div>
                </Link>
              </Col>
            ))
          )}
        </Row>
      </div>

      <div className="mb-10">
        <div className="flex items-end justify-between mb-8 pb-2 border-b border-gray-100">
          <Title level={2} className="text-text1 !text-2xl md:!text-3xl !font-bold !m-0 tracking-tight">
            <FireOutlined className="text-primary mr-2" />
            Có Thể Bạn Sẽ Thích
          </Title>
        </div>

        {/* Tái sử dụng component BoxListTour để hiển thị danh sách 5 tour ngẫu nhiên */}
        <BoxListTour tours={randomTours} loading={loading} />
      </div>
    </div>
  );
}

export default Categories;
