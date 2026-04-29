import React, { useState } from 'react';
import { Card, Table, Tag, Input, Space, Select, Skeleton, Popconfirm, message, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAdminOrders } from '../../../hooks/useAdminOrders';
import { deleteAdminOrder } from '../../../services/adminOrderServices';
import DetailOrderModal from '../../../features/AdminOrdersFeature/DetailOrderModal';

const { Search } = Input;
const { Option } = Select;

function AdminOrders() {
  const { orders, statistics, pagination, loading, queryParams, setQueryParams, refetchOrders } = useAdminOrders();
  const permissions = useSelector(state => state.account?.userInfo?.role?.permissions || []);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailOrderId, setDetailOrderId] = useState(null);

  const showDetailModal = (id) => {
    setDetailOrderId(id);
    setIsDetailModalVisible(true);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setDetailOrderId(null);
  };

  const handleDelete = async (id) => {
    try {
      message.loading({ content: 'Đang xóa đơn hàng...', key: 'delOrder' });
      await deleteAdminOrder(id);
      message.success({ content: 'Đã xóa đơn hàng thành công!', key: 'delOrder', duration: 2 });
      refetchOrders();
    } catch (error) {
      message.error({ content: 'Lỗi hệ thống khi xóa đơn hàng', key: 'delOrder', duration: 2 });
    }
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 250,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-gray-800 font-bold text-sm mb-1">{record.fullName}</span>
          <span className="text-gray-500 text-xs mb-0.5">{record.phone}</span>
        </div>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      key: 'paymentMethod',
      dataIndex: 'paymentMethod',
      render: (method) => (
        <span className="text-gray-600 font-medium whitespace-nowrap">
          {method}
        </span>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => <span className="font-bold">{text?.toLocaleString()} đ</span>,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color = '';
        if (status === 'confirmed') {
          color = 'blue';
        } else if (status === 'pending') {
          color = 'warning';
        } else {
          color = 'error';
        }

        const mapLabel = {
          'confirmed': 'Đã xác nhận',
          'pending': 'Chờ xử lý',
          'cancelled': 'Đã hủy'
        }

        return (
          <Tag color={color} className="rounded-full px-3 py-1 font-medium border-none">
            {mapLabel[status]}
          </Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space size="large">
          <EyeOutlined
            className="text-blue-500 text-lg hover:text-blue-600 transition-colors cursor-pointer"
            title="Xem chi tiết"
            onClick={() => showDetailModal(record._id)}
          />
          <Tooltip title={permissions.includes('order-delete') ? "Xóa" : "Không có quyền"}>
            <Popconfirm
              title="Xóa đơn hàng này?"
              description="Bạn có chắc chắn muốn xóa đơn hàng này không?"
              disabled={!permissions.includes('order-delete')}
              onConfirm={() => handleDelete(record._id)}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className={`text-lg transition-colors ${permissions.includes('order-delete') ? 'text-red-500 hover:text-red-600 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`} title="Xóa" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0" style={{ color: 'var(--color-text1)' }}>
            QUẢN LÝ ĐƠN ĐẶT TOUR
          </h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách tất cả các đơn đặt tour của khách hàng</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="shadow-sm rounded-xl border-gray-100" styles={{ body: { padding: '16px 20px' } }}>
          <p className="text-gray-500 text-sm mb-2">Tổng đơn hàng</p>
          <p className="text-xl font-bold m-0 text-gray-800">{statistics?.total || 0}</p>
        </Card>
        <Card className="shadow-sm rounded-xl border-gray-100" styles={{ body: { padding: '16px 20px' } }}>
          <p className="text-gray-500 text-sm mb-2">Đã xác nhận</p>
          <p className="text-xl font-bold m-0 text-blue-500">{statistics?.confirmed || 0}</p>
        </Card>
        <Card className="shadow-sm rounded-xl border-gray-100" styles={{ body: { padding: '16px 20px' } }}>
          <p className="text-gray-500 text-sm mb-2">Chờ xử lý</p>
          <p className="text-xl font-bold m-0 text-yellow-500">{statistics?.pending || 0}</p>
        </Card>
        <Card className="shadow-sm rounded-xl border-gray-100" styles={{ body: { padding: '16px 20px' } }}>
          <p className="text-gray-500 text-sm mb-2">Đã hủy</p>
          <p className="text-xl font-bold m-0 text-red-500">{statistics?.cancelled || 0}</p>
        </Card>
        <Card className="shadow-sm rounded-xl border-gray-100" styles={{ body: { padding: '16px 20px' } }}>
          <p className="text-gray-500 text-sm mb-2">Doanh thu</p>
          <p className="text-xl font-bold m-0 text-green-500">{statistics?.totalRevenue ? statistics.totalRevenue.toLocaleString() : 0} đ</p>
        </Card>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-800 m-0" style={{ color: 'var(--color-text1)' }}>
            Tất cả đơn đặt
          </h2>
          <Space>
            <Search
              placeholder="Tìm kiếm"
              style={{ width: 250 }}
              allowClear
              onSearch={(val) => setQueryParams(prev => ({ ...prev, keyword: val, page: 1 }))}
            />
            <Select
              value={queryParams.status}
              style={{ width: 140 }}
              onChange={(val) => setQueryParams(prev => ({ ...prev, status: val, page: 1 }))}
            >
              <Option value="">Tất cả trạng thái</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="pending">Chờ xử lý</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Space>
        </div>

        {/* The Table */}
        <div className="p-0">
          <Skeleton active loading={loading} paragraph={{ rows: 8 }} className="p-6">
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              loading={false}
              pagination={{
                current: pagination?.currentPage || 1,
                pageSize: pagination?.limitItems || 5,
                total: pagination?.totalItems || orders.length,
                showSizeChanger: false,
                onChange: (page) => setQueryParams(prev => ({ ...prev, page }))
              }}
              className="w-full"
              rowClassName="hover:bg-gray-50/50 transition-colors"
            />
          </Skeleton>
        </div>
      </div>

      <DetailOrderModal
        visible={isDetailModalVisible}
        onCancel={handleDetailCancel}
        orderId={detailOrderId}
        refetchOrders={refetchOrders}
      />
    </div>
  );
}

export default AdminOrders;