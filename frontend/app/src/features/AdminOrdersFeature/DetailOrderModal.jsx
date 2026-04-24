import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Divider, Row, Col, Spin, Typography, Table, Image, Button, Space, message } from 'antd';
import { UserOutlined, ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';
import { getAdminDetailOrder, changeOrderStatus } from '../../services/adminOrderServices';
import formatDateHelper from '../../helpers/formatDateHelper';

const { Text } = Typography;

function DetailOrderModal(props) {
  const { visible, onCancel, orderId, refetchOrders } = props;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && orderId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await getAdminDetailOrder(orderId);
          if (res && res.data) {
            setOrderData(res.data);
          }
        } catch (error) {
          console.error("Lỗi khi fetch chi tiết đơn hàng:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [visible, orderId]);

  const mapPaymentMethod = (method) => {
    switch (method) {
      case 'credit_card': return 'Thẻ tín dụng/Ghi nợ';
      case 'atm_card': return 'Thẻ ATM nội địa';
      case 'cash_on_delivery': return 'Thanh toán trực tiếp';
      default: return method;
    }
  };

  const getStatusTag = (status) => {
    let color = '';
    let label = '';
    switch (status) {
      case 'confirmed': color = 'blue'; label = 'Đã xác nhận'; break;
      case 'pending': color = 'warning'; label = 'Chờ xử lý'; break;
      case 'cancelled': color = 'error'; label = 'Đã hủy'; break;
      default: color = 'default'; label = status;
    }
    return <Tag color={color} className="rounded-full px-3 py-1 font-medium border-none">{label}</Tag>;
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (img) => (
        <Image src={img || 'https://placehold.co/100'} alt="tour" className="w-16 h-16 object-cover rounded-md border border-gray-100" />
      ),
    },
    {
      title: 'Thông tin Tour',
      key: 'tourInfo',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{record.info?.title || 'Tour không tồn tại'}</span>
          <span className="text-xs text-gray-500">Mã: {record.info?.code}</span>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price_special',
      key: 'price',
      render: (price) => <span className="font-semibold">{price ? price.toLocaleString() : 0} đ</span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty) => <span>{qty} người</span>,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span className="font-bold">{total ? total.toLocaleString() : 0} đ</span>,
    },
  ];

  const order = orderData?.order;
  const items = orderData?.orderItems || [];

  const handleUpdateStatus = async (newStatus) => {
    if (order?._id) {
      try {
        message.loading({ content: 'Đang cập nhật trạng thái...', key: 'updateStatus' });
        await changeOrderStatus(newStatus, order._id);

        setOrderData(prev => ({
          ...prev,
          order: { ...prev.order, status: newStatus }
        }));

        if (refetchOrders) {
          refetchOrders();
        }
        message.success({ content: 'Cập nhật trạng thái thành công!', key: 'updateStatus', duration: 2 });
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        message.error({ content: 'Lỗi khi cập nhật trạng thái', key: 'updateStatus', duration: 2 });
      }
    }
  };

  const renderFooter = () => {
    if (!order) return null;
    return (
      <Space className="w-full justify-between items-center mt-2">
        <Button onClick={onCancel}>Đóng</Button>
        <Space>
          {order.status === 'pending' && (
            <>
              <Button danger onClick={() => handleUpdateStatus('cancelled')}>Hủy đơn hàng</Button>
              <Button type="primary" onClick={() => handleUpdateStatus('confirmed')}>Xác nhận Đơn</Button>
            </>
          )}
        </Space>
      </Space>
    );
  };

  return (
    <Modal
      title={<span className="text-xl font-bold text-text1 flex items-center">Chi tiết Đơn hàng </span>}
      open={visible}
      onCancel={onCancel}
      footer={renderFooter()}
      width={1100}
      styles={{ body: { padding: '24px' } }}
      centered
    >
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        {order ? (
          <div>
            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Mã đơn hàng</span>
                <span className="text-xl font-bold text-gray-800">{order.code}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-gray-500 text-sm mb-1">Trạng thái</span>
                  {getStatusTag(order.status)}
                </div>
              </div>
            </div>

            <Row gutter={24}>
              <Col span={12}>
                <Divider orientation="left" className="!mt-0"><span className="text-sm font-bold text-gray-500 uppercase flex items-center"><UserOutlined className="mr-2 text-blue-500" /> Khách hàng</span></Divider>
                <Descriptions column={1} size="small" labelStyle={{ color: '#718096', fontWeight: 500, width: '120px' }}>
                  <Descriptions.Item label="Họ tên"><Text strong>{order.fullName}</Text></Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại"><Text strong>{order.phone}</Text></Descriptions.Item>
                  <Descriptions.Item label="Ghi chú"><Text type={order.note ? 'default' : 'secondary'}>{order.note || 'Không có ghi chú'}</Text></Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Divider orientation="left" className="!mt-0"><span className="text-sm font-bold text-gray-500 uppercase flex items-center"><CreditCardOutlined className="mr-2 text-blue-500" /> Thanh toán</span></Divider>
                <Descriptions column={1} size="small" labelStyle={{ color: '#718096', fontWeight: 500, width: '150px' }}>
                  <Descriptions.Item label="Phương thức"><Text strong>{mapPaymentMethod(order.paymentMethod)}</Text></Descriptions.Item>
                  <Descriptions.Item label="Thời gian đặt"><Text strong>{formatDateHelper(order.createdAt)}</Text></Descriptions.Item>
                  <Descriptions.Item label="Tổng thanh toán"><Text strong className="text-lg">{order.totalAmount?.toLocaleString()} đ</Text></Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>

            <Divider orientation="left" className="!mt-6"><span className="text-sm font-bold text-gray-500 uppercase flex items-center"><ShoppingCartOutlined className="mr-2 text-blue-500" /> Danh sách Tour</span></Divider>
            <Table
              columns={columns}
              dataSource={items}
              rowKey="_id"
              pagination={false}
              bordered={true}
              className="mt-2"
            />
          </div>
        ) : !loading && (
          <div className="py-20 text-center">
            <Text type="secondary">Không tìm thấy thông tin đơn hàng này.</Text>
          </div>
        )}
      </Spin>
    </Modal>
  );
}

export default DetailOrderModal;
