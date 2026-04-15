import React from 'react';
import { Modal, Tag, Divider, Row, Col, Spin, Typography, Space } from 'antd';
import { InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const DetailCategoryModal = ({ visible, onCancel, category, loading }) => {
  return (
    <Modal
      title={<span className="text-xl font-bold text-text1 flex items-center gap-2"><InfoCircleOutlined className="text-blue-500" /> Chi tiết Danh Mục</span>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <Spin spinning={loading} tip="Đang tải...">
        {category ? (
          <div className="py-2">
            <Row gutter={[24, 16]}>
              {/* Image */}
              <Col span={8}>
                <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 aspect-square bg-gray-50 flex items-center justify-center">
                  <img
                    src={category.image || 'https://placehold.co/200x200?text=No+Image'}
                    alt={category.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=No+Image'; }}
                  />
                </div>
              </Col>

              {/* Info */}
              <Col span={16}>
                <Space direction="vertical" size="small" className="w-full">
                  <div className="flex items-center justify-between">
                    <Tag
                      color={category.status === 'active' ? 'success' : 'error'}
                      className="rounded-full px-3 py-0.5 font-semibold"
                    >
                      {category.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </Tag>
                    <Text className="text-gray-400 text-xs">Vị trí: #{category.position}</Text>
                  </div>

                  <Title level={3} className="!mb-0 !mt-2 text-text1">{category.title}</Title>
                  <Text className="text-gray-400 text-xs font-mono">Slug: {category.slug}</Text>
                </Space>
              </Col>
            </Row>

            <Divider orientation="left" className="mt-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <FileTextOutlined className="text-blue-500" /> Mô tả
              </span>
            </Divider>

            <div className="bg-gray-50 rounded-lg p-4 min-h-[60px]">
              {category.description ? (
                <Text className="text-gray-600 leading-relaxed">{category.description}</Text>
              ) : (
                <Text type="secondary" italic>Chưa có mô tả.</Text>
              )}
            </div>
          </div>
        ) : !loading && (
          <div className="py-16 text-center">
            <Text type="secondary">Không tìm thấy thông tin danh mục này.</Text>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

export default DetailCategoryModal;
