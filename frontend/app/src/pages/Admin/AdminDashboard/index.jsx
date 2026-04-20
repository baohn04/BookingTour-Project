import React from 'react';
import { Row, Col, Card, Table, Tag, Skeleton } from 'antd';
import {
  DollarOutlined,
  ContainerOutlined,
  EnvironmentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Column, Line } from '@ant-design/plots';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';
import StatCard from '../../../features/AdminDashboardFeature/StatCard';

function AdminDashboard() {
  const { stats, chartData, recentBookings, loading } = useAdminDashboard();

  // --- CHART CONFIGURATIONS ---
  const columnConfig = {
    data: chartData?.weeklyRevenue || [],
    xField: 'day',
    yField: 'value',
    color: 'blue',
    legend: false,
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0,
      },
    },
    tooltip: {
      title: 'doanh thu',
    },
    meta: {
      value: { alias: 'Revenue' },
    },
  };

  const lineConfig = {
    data: chartData?.weeklyBookings || [],
    xField: 'day',
    yField: 'value',
    color: 'blue',
    shapeField: 'smooth',
    point: {
      shape: 'circle',
      size: 4,
      style: {
        fill: '#ffffff',
        stroke: 'blue',
        lineWidth: 2,
      },
    },
    tooltip: {
      title: 'bookings',
    },
    meta: {
      value: { alias: 'Bookings' },
    },
  };

  const tableColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      className: 'text-gray-600',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
      className: 'text-gray-800',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      className: 'text-gray-600',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      className: 'text-gray-800 ',
      render: (amount) => amount ? `${amount.toLocaleString()} đ` : '0 đ',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        const st = status || 'pending';
        if (st === 'confirmed') color = 'processing';
        else if (st === 'pending') color = 'warning';
        else if (st === 'cancelled') color = 'error';

        return (
          <Tag color={color} className="rounded-full px-3 py-1 border-none capitalize">
            {st === 'confirmed' ? 'Đã xác nhận' : st === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
          </Tag>
        );
      },
    },
  ];


  return (
    <div>
      {/* 1. Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">TỔNG QUAN</h1>
      </div>

      {/* 2. Top Statistic Cards Row */}
      <Row gutter={[20, 20]} className="mb-6">
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Doanh thu"
            value={`${stats.totalRevenue.value.toLocaleString()} đ`}
            percentage={stats.totalRevenue.percentage}
            isUp={stats.totalRevenue.isUp}
            icon={<DollarOutlined />}
            iconBg="#dcfce7"
            iconColor="#16a34a"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Tổng đơn"
            value={stats.totalBookings.value.toLocaleString()}
            percentage={stats.totalBookings.percentage}
            isUp={stats.totalBookings.isUp}
            icon={<ContainerOutlined />}
            iconBg="#e0e7ff"
            iconColor="#4f46e5"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Tour đang hoạt động"
            value={stats.activeTours.value.toLocaleString()}
            percentage={stats.activeTours.percentage}
            isUp={stats.activeTours.isUp}
            icon={<EnvironmentOutlined />}
            iconBg="#f3e8ff"
            iconColor="#9333ea"
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            loading={loading}
            title="Tổng người dùng"
            value={stats.totalUsers.value.toLocaleString()}
            percentage={stats.totalUsers.percentage}
            isUp={stats.totalUsers.isUp}
            icon={<TeamOutlined />}
            iconBg="#ffedd5"
            iconColor="#ea580c"
          />
        </Col>
      </Row>

      {/* 3. Charts Row */}
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-xl border border-gray-100 h-full"
            title={<span className="text-gray-700 font-semibold text-base">Doanh trong thu tuần</span>}
          >
            <Skeleton active loading={loading} paragraph={{ rows: 7 }} title={false}>
              <div style={{ height: 300 }}>
                <Column {...columnConfig} />
              </div>
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-xl border border-gray-100 h-full"
            title={<span className="text-gray-700 font-semibold text-base">Số đơn trong tuần</span>}
          >
            <Skeleton active loading={loading} paragraph={{ rows: 7 }} title={false}>
              <div style={{ height: 300 }}>
                <Line {...lineConfig} />
              </div>
            </Skeleton>
          </Card>
        </Col>
      </Row>

      {/* 4. Recent Bookings Table Section */}
      <div className="mt-6 mb-6">
        <Card
          variant="borderless"
          className="shadow-sm rounded-xl border border-gray-100"
          title={<span className="text-gray-700 font-semibold text-base">Các đơn gần đây</span>}
        >
          <Table
            columns={tableColumns}
            dataSource={recentBookings}
            pagination={false}
            className="w-full"
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
