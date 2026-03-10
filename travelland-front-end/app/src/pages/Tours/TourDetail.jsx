import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Row,
  Col,
  Button,
  Image,
  Divider,
  Avatar,
  Form,
  Input,
  Calendar,
  Skeleton,
} from "antd";
import { Link, useParams } from "react-router-dom";
import {
  ShareAltOutlined,
  StarFilled,
  HeartOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  TeamOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { getTourDetail } from "../../services/tourServices";
import dayjs from "dayjs";
import BookingSidebar from "../../features/Tours_temp/BookingSidebar";


function TourDetail() {
  const { slug } = useParams();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tourDetail, setTourDetail] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await getTourDetail(slug);
        if (result.data) {
          setTourDetail(result.data);
        }
      } catch (error) {
        console.error("Error fetching tour detail data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, [slug]);

  // Lấy danh sách ảnh, nếu không có thì dùng fallback
  const images = tourDetail?.images && tourDetail.images.length > 0
    ? tourDetail.images
    : [];

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8 font-sans bg-background">
      {/* 1. Header & Breadcrumb */}
      <Row gutter={[0, 20]}>
        <Col xs={24}>
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/tours">Danh sách Tour</Link> },
              {
                title: loading ? (
                  <Skeleton.Input size="small" active style={{ width: 200 }} />
                ) : (
                  tourDetail?.title || slug
                ),
              },
            ]}
          />
        </Col>

        {/* Title */}
        <Col xs={24}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 1 }} title={{ width: "70%" }} />
          ) : (
            <h1 className="text-3xl md:text-4xl font-extrabold text-text1 m-0 leading-tight">
              {tourDetail?.title || "Tour Detail"}
            </h1>
          )}
        </Col>

        {/* Meta info row */}
        <Col xs={24}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              {loading ? (
                <Skeleton.Input active style={{ width: 300 }} />
              ) : (
                <div className="flex items-center gap-3 text-text1 text-sm md:text-base flex-wrap">
                  {/* Rating placeholder */}
                  <span className="font-semibold flex items-center gap-1">
                    <StarFilled className="text-yellow-500" />
                    4.8
                  </span>
                  <span className="text-gray-400">•</span>

                  {/* Điểm đi - điểm đến */}
                  {tourDetail?.startDeparture && (
                    <>
                      <span className="font-medium flex items-center gap-1">
                        <EnvironmentOutlined className="text-primary" />
                        {tourDetail.startDeparture}
                        {tourDetail?.endDeparture
                          ? ` → ${tourDetail.endDeparture}`
                          : ""}
                      </span>
                      <span className="text-gray-400">•</span>
                    </>
                  )}

                  {/* Thời gian tour */}
                  {tourDetail?.timeTour && (
                    <>
                      <span className="font-medium flex items-center gap-1">
                        <ClockCircleOutlined className="text-primary" />
                        {tourDetail.timeTour}
                      </span>
                      <span className="text-gray-400">•</span>
                    </>
                  )}

                  {/* Chỗ còn */}
                  {tourDetail?.stock !== undefined && (
                    <span className="font-medium flex items-center gap-1">
                      <TeamOutlined className="text-primary" />
                      Còn {tourDetail.stock} chỗ
                    </span>
                  )}
                </div>
              )}
            </Col>

            <Col xs={24} md={8}>
              <div className="flex justify-start md:justify-end gap-2 text-text1">
                <Button
                  type="text"
                  icon={<ShareAltOutlined />}
                  className="font-medium hover:!text-primary flex items-center"
                >
                  Chia sẻ
                </Button>
                <Button
                  type="text"
                  icon={<HeartOutlined />}
                  className="font-medium hover:!text-primary flex items-center"
                >
                  Yêu thích
                </Button>
              </div>
            </Col>
          </Row>
        </Col>

        {/* 2. Image Grid Viewer */}
        <Col xs={24} className="mt-4">
          {loading ? (
            <Skeleton.Image
              active
              style={{ width: "100%", height: 400, borderRadius: 16 }}
            />
          ) : (
            <Image.PreviewGroup
              preview={{
                visible: previewVisible,
                onVisibleChange: (visible) => setPreviewVisible(visible),
              }}
            >
              <Row gutter={[16, 16]} className="h-[300px] md:h-[500px]">
                {/* Ảnh chính */}
                <Col xs={24} md={16} className="h-full">
                  <Image
                    src={images[0]}
                    alt={tourDetail?.title || "Tour cover"}
                    className="rounded-2xl md:rounded-l-2xl md:rounded-r-none object-cover transition-transform duration-300 hover:scale-[1.02]"
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      borderRadius: "1rem",
                    }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </Col>

                {/* 2 ảnh phụ */}
                <Col xs={0} md={8} className="h-full hidden md:block">
                  <Row gutter={[0, 16]} className="h-full flex-col">
                    <Col flex="1" className="h-[calc(50%-8px)]">
                      <Image
                        src={images[1] || images[0]}
                        alt="Tour detail 1"
                        className="rounded-tr-2xl object-cover transition-transform duration-300 hover:scale-[1.05]"
                        wrapperStyle={{
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                          borderTopRightRadius: "1rem",
                        }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </Col>

                    <Col flex="1" className="h-[calc(50%-8px)] relative group">
                      <Image
                        src={images[2] || images[0]}
                        alt="Tour detail 2"
                        className="rounded-br-2xl object-cover transition-transform duration-300 hover:scale-[1.05]"
                        wrapperStyle={{
                          width: "100%",
                          height: "100%",
                          overflow: "hidden",
                          borderBottomRightRadius: "1rem",
                        }}
                        style={{ width: "100%", height: "100%" }}
                      />
                      {images.length > 3 && (
                        <Button
                          onClick={() => setPreviewVisible(true)}
                          className="absolute bottom-4 right-4 z-10 bg-[#05073C] text-white hover:!bg-[#0a0e5c] hover:!text-white border-none rounded-lg px-4 py-2 font-semibold shadow-lg min-h-[40px]"
                        >
                          +{images.length - 3} ảnh
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Ảnh ẩn để preview group */}
              <div style={{ display: "none" }}>
                {images.slice(3).map((src, index) => (
                  <Image key={index + 3} src={src} />
                ))}
              </div>
            </Image.PreviewGroup>
          )}
        </Col>
      </Row>

      {/* 3. Main Detailed Content */}
      <Row gutter={[48, 48]} className="mt-12">
        {/* Left Column */}
        <Col xs={24} lg={16}>

          {/* Thông tin nhanh */}
          {!loading && tourDetail && (
            <section className="bg-gray-50 rounded-2xl p-6 mb-8">
              <Row gutter={[16, 16]}>
                {tourDetail.code && (
                  <Col xs={12} sm={8}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BarcodeOutlined className="text-primary text-lg" />
                      <div>
                        <div className="font-semibold text-text1 text-xs uppercase tracking-wide mb-0.5">Mã tour</div>
                        <div className="font-bold text-text1">{tourDetail.code}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {tourDetail.timeTour && (
                  <Col xs={12} sm={8}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <ClockCircleOutlined className="text-primary text-lg" />
                      <div>
                        <div className="font-semibold text-text1 text-xs uppercase tracking-wide mb-0.5">Thời gian</div>
                        <div className="font-bold text-text1">{tourDetail.timeTour}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {tourDetail.timeStart && (
                  <Col xs={12} sm={8}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarOutlined className="text-primary text-lg" />
                      <div>
                        <div className="font-semibold text-text1 text-xs uppercase tracking-wide mb-0.5">Ngày khởi hành</div>
                        <div className="font-bold text-text1">
                          {dayjs(tourDetail.timeStart).format("DD/MM/YYYY")}
                        </div>
                      </div>
                    </div>
                  </Col>
                )}
                {tourDetail.startDeparture && (
                  <Col xs={12} sm={8}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvironmentOutlined className="text-primary text-lg" />
                      <div>
                        <div className="font-semibold text-text1 text-xs uppercase tracking-wide mb-0.5">Điểm đi</div>
                        <div className="font-bold text-text1">{tourDetail.startDeparture}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {tourDetail.endDeparture && (
                  <Col xs={12} sm={8}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <EnvironmentOutlined className="text-primary text-lg" />
                      <div>
                        <div className="font-semibold text-text1 text-xs uppercase tracking-wide mb-0.5">Điểm đến</div>
                        <div className="font-bold text-text1">{tourDetail.endDeparture}</div>
                      </div>
                    </div>
                  </Col>
                )}
                {tourDetail.stock !== undefined && (
                  <Col xs={12} sm={8}>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TeamOutlined className="text-primary text-lg" />
                      <div>
                        <div className="font-semibold text-text1 text-xs uppercase tracking-wide mb-0.5">Số chỗ còn</div>
                        <div className="font-bold text-text1">{tourDetail.stock} chỗ</div>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </section>
          )}

          {/* Tour Overview / Thông tin */}
          <section>
            <h2 className="text-2xl font-bold text-text1 mb-4">Mô tả Tour</h2>
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <div
                className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: tourDetail?.information || "Chưa có thông tin mô tả.",
                }}
              />
            )}
          </section>

          <Divider className="my-10 border-gray-100" />

          {/* Lịch trình (schedule) */}
          <section>
            <h2 className="text-2xl font-bold text-text1 mb-6">Lịch trình</h2>
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : tourDetail?.schedule ? (
              <div
                className="text-gray-600 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: tourDetail.schedule }}
              />
            ) : (
              <p className="text-gray-400 italic">Chưa có lịch trình.</p>
            )}
          </section>

          <Divider className="my-10 border-gray-100" />

          {/* Availability Calendar */}
          <section>
            <h2 className="text-2xl font-bold text-text1 mb-6">
              Lịch khởi hành
            </h2>
            <div className="border border-gray-200 rounded-2xl p-4 w-full md:w-[400px]">
              <Calendar
                fullscreen={false}
                defaultValue={
                  tourDetail?.timeStart
                    ? dayjs(tourDetail.timeStart)
                    : dayjs()
                }
              />
            </div>
            {tourDetail?.timeStart && (
              <p className="mt-3 text-gray-500 text-sm flex items-center gap-2">
                <CalendarOutlined className="text-primary" />
                Ngày khởi hành:{" "}
                <span className="font-semibold text-text1">
                  {dayjs(tourDetail.timeStart).format("DD/MM/YYYY")}
                </span>
              </p>
            )}
          </section>

          <Divider className="my-10 border-gray-100" />

          {/* Customer Reviews */}
          <section>
            <h2 className="text-2xl font-bold text-text1 mb-6">
              Đánh giá khách hàng
            </h2>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-8">
                <Avatar
                  size={50}
                  icon={<UserOutlined />}
                  src="https://i.pravatar.cc/150?img=32"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-text1 text-base m-0">
                        Ali Tufan
                      </h4>
                      <span className="text-sm text-gray-500">
                        Tháng 4, 2024
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Tour tuyệt vời! Mọi thứ từ lúc đón đến lúc tiễn đều hoàn
                    hảo. Hướng dẫn viên nhiệt tình, cảnh đẹp ngoạn mục.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {images.slice(0, 3).map((src, i) => (
                      <Image
                        key={i}
                        src={src}
                        className="w-20 h-20 rounded-lg object-cover"
                        alt="review"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Button className="mt-6 border border-gray-200 text-text1 hover:border-primary hover:text-primary font-bold px-8 h-12 rounded-lg">
              Xem tất cả đánh giá
            </Button>
          </section>

          <Divider className="my-10 border-gray-100" />

          {/* Leave a Reply */}
          <section>
            <h2 className="text-2xl font-bold text-text1 mb-2">
              Gửi đánh giá
            </h2>
            <p className="text-gray-500 mb-6">
              Email của bạn sẽ không được hiển thị công khai. *
            </p>

            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span className="font-semibold text-text1">Họ tên *</span>
                    }
                    name="name"
                  >
                    <Input
                      size="large"
                      className="rounded-lg bg-gray-50 border border-gray-200 hover:!border-primary focus:!border-primary focus:bg-white h-12 transition-colors"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={
                      <span className="font-semibold text-text1">Email *</span>
                    }
                    name="email"
                  >
                    <Input
                      size="large"
                      className="rounded-lg bg-gray-50 border border-gray-200 hover:!border-primary focus:!border-primary focus:bg-white h-12 transition-colors"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label={
                      <span className="font-semibold text-text1">Tiêu đề *</span>
                    }
                    name="title"
                  >
                    <Input
                      size="large"
                      className="rounded-lg bg-gray-50 border border-gray-200 hover:!border-primary focus:!border-primary focus:bg-white h-12 transition-colors"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    label={
                      <span className="font-semibold text-text1">
                        Nội dung *
                      </span>
                    }
                    name="comment"
                  >
                    <Input.TextArea
                      rows={5}
                      className="rounded-lg bg-gray-50 border border-gray-200 hover:!border-primary focus:!border-primary focus:bg-white transition-colors"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="primary"
                size="large"
                className="bg-primary hover:!bg-primary-hover border-none font-bold px-8 h-12 rounded-lg mt-2 shadow-md"
              >
                Gửi
              </Button>
            </Form>
          </section>
        </Col>

        {/* Right Sidebar (Booking Widget) */}
        <Col xs={24} lg={8}>
          <BookingSidebar key={tourDetail.id} tourDetail={tourDetail} loading={loading} />
        </Col>
      </Row>
    </div>
  );
}

export default TourDetail;