import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Divider, Row, Col, Spin, Image, Typography, Space } from 'antd';
import { CalendarOutlined, DollarOutlined, EnvironmentOutlined, StockOutlined, InfoCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { getAdminDetailTour } from '../../services/adminTourServices';

const { Title, Text } = Typography;

function DetailTourModal(props) {
  const { visible, onCancel, tourId } = props;

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && tourId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await getAdminDetailTour(tourId);
          if (res && res.data) {
            setTour(res.data);
          }
        } catch (error) {
          console.error("Lỗi khi fetch chi tiết tour:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [visible, tourId]);

  return (
    <Modal
      title={<span className="text-xl font-bold text-text1 flex items-center">Chi tiết </span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1100}
      bodyStyle={{ padding: '24px' }}
      centered
      className="detail-tour-modal"
    >
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {tour ? (
          <div>
            <Row gutter={[24, 24]}>
              <Col span={10}>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={tour.images && tour.images.length > 0 ? tour.images[0] : 'https://placehold.co/400x300'}
                    alt={tour.title}
                    className="w-full object-cover h-[350px]"
                  />
                </div>
                {tour.images && tour.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {tour.images.slice(1).map((img, index) => (
                      <Image key={index} src={img} className="rounded object-cover h-16 w-full cursor-pointer hover:opacity-80 transition-all border border-gray-100" />
                    ))}
                  </div>
                )}
              </Col>

              <Col span={14}>
                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center justify-between">
                    <Tag color={tour.status === 'active' ? 'success' : 'error'} className="rounded-full px-3 py-1 font-semibold uppercase">
                      {tour.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </Tag>
                    <Text className="text-gray-400 font-medium">Mã: {tour.code}</Text>
                  </div>

                  <Title level={2} className="!mb-0 text-text1 leading-tight">{tour.title}</Title>

                  <div className="flex items-center gap-6 py-2">
                    <div className="flex flex-col">
                      <Text className="text-gray-400 text-xs">Giá hiện tại</Text>
                      <Text className="text-2xl font-bold text-text1">
                        {tour.price_special ? tour.price_special.toLocaleString() : tour.price?.toLocaleString()} <span className="text-sm">VNĐ</span>
                      </Text>
                    </div>
                    {tour.discount > 0 && (
                      <div className="flex flex-col">
                        <Text className="text-gray-400 text-xs text-center">Giảm giá</Text>
                        <Tag color="volcano" className="font-bold">-{tour.discount}%</Tag>
                      </div>
                    )}
                  </div>
                </Space>

                <Divider className="my-4" />

                <Descriptions column={2} size="small" className="tour-desc-list">
                  <Descriptions.Item label={<span><CalendarOutlined className="mr-2 text-blue-500" />Thời gian</span>}>
                    <Text strong>{tour.timeTour}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span><CalendarOutlined className="mr-2 text-blue-500" />Ngày khởi hành</span>}>
                    <Text strong>{tour.timeStart ? new Date(tour.timeStart).toLocaleDateString('vi-VN') : 'Liên hệ'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span><StockOutlined className="mr-2 text-blue-500" />Còn trống</span>}>
                    <Text strong>{tour.stock} chỗ</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span><DollarOutlined className="mr-2 text-blue-500" />Giá gốc</span>}>
                    <Text delete className="text-gray-400">{tour.price?.toLocaleString()} đ</Text>
                  </Descriptions.Item>
                </Descriptions>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <EnvironmentOutlined className="text-xl text-red-500 mr-3" />
                    <div className="flex flex-col">
                      <Text className="text-xs text-gray-500 uppercase tracking-wider">Hành trình</Text>
                      <Text strong className="text-sm">{tour.startDeparture} <span className="mx-2 text-gray-400">→</span> {tour.endDeparture}</Text>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Divider orientation="left"><span className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center"><InfoCircleOutlined className="mr-2 text-blue-500" /> Thông tin mô tả</span></Divider>
            <div className="rich-text-content px-2 pb-2">
              {tour.information ? (
                <div dangerouslySetInnerHTML={{ __html: tour.information }} />
              ) : (
                <Text type="secondary" italic>Chưa có thông tin mô tả chi tiết.</Text>
              )}
            </div>

            <Divider orientation="left"><span className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center"><ScheduleOutlined className="mr-2 text-blue-500" /> Lịch trình</span></Divider>
            <div className="rich-text-content px-2">
              {tour.schedule ? (
                <div dangerouslySetInnerHTML={{ __html: tour.schedule }} />
              ) : (
                <Text type="secondary" italic>Chưa có thông tin lịch trình.</Text>
              )}
            </div>
          </div>
        ) : !loading && (
          <div className="py-20 text-center">
            <Text type="secondary">Không tìm thấy thông tin tour này.</Text>
          </div>
        )}
      </Spin>
      <style jsx="true">{`
        .rich-text-content {
          color: #4a5568;
          line-height: 1.6;
        }
        .rich-text-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 12px 0;
        }
        .tour-desc-list .ant-descriptions-item-label {
          color: #718096;
          font-weight: 500;
        }
      `}</style>
    </Modal>
  );
};

export default DetailTourModal;