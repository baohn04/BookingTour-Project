import React, { useState, useEffect } from 'react';
import { Typography, Button, Row, Col, Avatar, Skeleton } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import SearchBox from '../../components/SearchBox';
import BoxList from '../../components/BoxList';
import './Home.css';
import { getHomePage } from '../../services/homeServices';

const { Title, Text } = Typography;

const HERO_BG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80";

const reviews = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Traveler',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    title: 'Excellent Service!',
    content: 'I had an amazing experience with this company. The service was top-notch, and the staff was incredibly friendly. I highly recommend them!',
  },
  {
    id: 2,
    name: 'Emily Davis',
    role: 'Explorer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    title: 'Unforgettable Journey',
    content: 'The tour guide was knowledgeable and the itinerary was perfect. Every moment was memorable. Will definitely book again!',
  },
  {
    id: 3,
    name: 'Michael Brown',
    role: 'Photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    title: 'Highly Recommended',
    content: 'Seamless booking process and great customer support. The trip exceeded my expectations in every way.',
  }
];

function Home() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const result = await getHomePage();
        if (result && result.data) {
          setCategories(result.data.categories);
          setFeaturedTours(result.data.featuredTours);
        }
      } catch (error) {
        console.error("Error download data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  const toggleFavorite = (id) => {
    setFeaturedTours(featuredTours.map(tour =>
      (tour.id === id) ? { ...tour, isFavorite: !tour.isFavorite } : tour
    ));
  };

  return (
    <div className="home-page pb-20">
      {/* Hero Section */}
      <div className="px-4 md:px-10">

        <div
          className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center flex-col rounded-[20px] overflow-hidden mt-6"
          style={{ backgroundImage: `url("${HERO_BG}")` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-transparent z-[1]" />

          {/* Content Wrapper */}
          <div className="relative z-[2] w-full px-5 flex flex-col items-center max-w-7xl mx-auto">
            <Title level={1} className="text-text2 !text-3xl md:!text-5xl !font-bold !text-center !mb-4 !drop-shadow-lg tracking-tight">
              Trải nghiệm khác biệt trong từng hành trình
            </Title>
            <Text className="text-text2 !text-base md:!text-lg !text-center !mb-10 max-w-2xl !drop-shadow-md font-medium">
              Khám phá thế giới cùng TravelLand. Tour giá tốt mỗi ngày
            </Text>

            {/* Component Search Box */}
            <div className="w-full max-w-[1200px] mt-8">
              <SearchBox categories={categories} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-16 px-4 md:px-10">

        <div className="mb-20">
          <div className="flex items-end justify-between mb-10 pb-2 border-b-0 border-text1">
            <Title level={2} className="text-text1 !text-2xl md:!text-[28px] !font-bold !m-0 tracking-tight">
              Danh mục tour du lịch
            </Title>
            <Button type="text" className="text-text1 hover:!text-primary-hover !font-semibold !text-sm">
              Xem thêm
            </Button>
          </div>

          <div className="custom-ant-carousel -mx-3">
            {loading ? (
              <div className="flex justify-between overflow-hidden gap-6 pb-12">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <Skeleton.Avatar active size={130} shape="circle" />
                    <Skeleton active paragraph={{ rows: 1, width: 80 }} title={false} />
                  </div>
                ))}
              </div>
            ) : (
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={10}
                slidesPerView={2}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                  1280: { slidesPerView: 5, spaceBetween: 24 },
                  1536: { slidesPerView: 7, spaceBetween: 24 },
                }}
                className="pb-12"
              >
                {categories && categories.length > 0 ? categories.map((item) => (
                  <SwiperSlide key={item.id} className="px-3 md:px-4 py-2">
                    <Link to={`/tours/${item.slug}`}>
                      <div className="flex flex-col items-center group cursor-pointer">
                        <div className="relative w-32 h-32 md:w-36 md:h-36 lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 ease-in-out border-[3px] border-transparent group-hover:border-primary">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        <div className="mt-5 text-center">
                          <Text className="block !text-[17px] !font-bold text-text1 group-hover:!text-primary-hover transition-colors">
                            {item.title}
                          </Text>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                )) : null}
              </Swiper>
            )}
          </div>
        </div>

        {loading ? (
          <Skeleton.Button active block style={{ height: 400, borderRadius: 30, marginBottom: 80 }} />
        ) : (
          <div className="mb-20 rounded-[30px] overflow-hidden" style={{ background: 'var(--color-primary)' }}>
            <Row gutter={0} className="flex-col-reverse md:flex-row">
              <Col xs={24} md={12} className="relative flex items-center p-8 md:p-14 lg:p-20 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.4] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' vector-effect='non-scaling-stroke' stroke='%23F97316' stroke-width='0.5' fill='none' /%3E%3C/svg%3E")`,
                    backgroundSize: '150px 150px',
                    mixBlendMode: 'multiply'
                  }}
                ></div>
                <div className="relative z-10 max-w-lg">
                  <Title level={2} className="text-text1 !text-3xl md:!text-4xl !font-extrabold mb-6 !leading-tight">
                    Khám phá những điểm đến tuyệt vời nhất thế giới
                  </Title>
                  <Text className="text-text1 text-lg block mb-8 font-medium">
                    Chúng tôi mang đến những trải nghiệm du lịch độc đáo, giúp bạn khám phá vẻ đẹp tiềm ẩn của mỗi vùng đất.
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    className="!h-14 !px-10 !rounded-full !bg-primary hover:!bg-primary-hover text-text2 !text-lg !font-bold !border-none !shadow-lg hover:!shadow-primary/30"
                  >
                    Tìm hiểu thêm
                  </Button>
                </div>
              </Col>
              <Col xs={24} md={12} className="relative h-[400px] md:h-auto min-h-[400px] md:min-h-[500px]">
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Beautiful Travel Destination"
                    className="w-full h-full object-cover"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)',
                      maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 100%)'
                    }}
                  />
                  <div className="absolute top-0 bottom-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[var(--color-primary)] to-transparent"></div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-20">
          <div className="flex items-end justify-between mb-8 pb-2 border-b-0 border-text1">
            <Title level={2} className="text-text1 !text-2xl md:!text-[28px] !font-bold !m-0 tracking-tight">
              Các tour phổ biến
            </Title>
            <Button type="text" className="text-text1 hover:!text-primary-hover !font-semibold !text-sm">
              Xem thêm
            </Button>
          </div>

          <BoxList tours={featuredTours} loading={loading} toggleFavorite={toggleFavorite} />
        </div>

        <div className="mb-20">
          <Title level={2} className="text-text1 !text-3xl md:!text-4xl !font-bold !text-center !mb-12">
            Customer Reviews
          </Title>

          {loading ? (
            <div className="flex flex-col items-center gap-6 pb-12">
              <Skeleton.Avatar active size={100} shape="circle" />
              <Skeleton active paragraph={{ rows: 2, width: '60%' }} title={{ width: '40%' }} className="flex flex-col items-center text-center" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto custom-ant-carousel">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="pb-12"
              >
                {reviews.map((review) => (
                  <SwiperSlide key={review.id} className="px-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="relative mb-6">
                        <Avatar
                          src={review.avatar}
                          size={100}
                          className="border-4 border-white shadow-lg"
                        />
                      </div>

                      <Text className="!text-primary !text-lg !font-semibold mb-3 block">
                        {review.title}
                      </Text>

                      <Text className="text-text1 !text-lg md:!text-2xl !leading-relaxed max-w-2xl mx-auto mb-6 block font-medium">
                        "{review.content}"
                      </Text>

                      <div>
                        <Text className="text-text1 !text-base !font-bold block">
                          {review.name}
                        </Text>
                        <Text className="text-text1 !text-sm">
                          {review.role}
                        </Text>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home;