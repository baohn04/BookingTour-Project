import React from 'react';
import { Row, Col, Card, Table, Tag, Skeleton } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ContainerOutlined,
  EnvironmentOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Column, Line } from '@ant-design/plots';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';

const StatCard = ({ title, value, percentage, isUp, icon, iconBg, iconColor, loading }) => (
  <Card variant="borderless" className="shadow-sm rounded-xl bg-white border border-gray-100">
    <Skeleton active loading={loading} paragraph={{ rows: 1 }} title={{ width: '60%' }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm mb-2 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">{value}</h3>
          <p className={`text-xs ${isUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1 font-medium`}>
            {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{percentage}% so với tháng trước</span>
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
      </div>
    </Skeleton>
  </Card>
);

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
      title: 'Booking Code',
      dataIndex: 'code',
      key: 'code',
      className: 'text-gray-600',
    },
    {
      title: 'Customer Name',
      dataIndex: 'fullName',
      key: 'fullName',
      className: 'text-gray-800',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      className: 'text-gray-600',
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      className: 'text-gray-800 ',
      render: (amount) => amount ? `${amount.toLocaleString()} đ` : '0 đ',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        const st = status || 'pending';
        if (st === 'confirmed') color = 'success';
        else if (st === 'pending') color = 'warning';
        else if (st === 'cancelled') color = 'error';

        return (
          <Tag color={color} className="rounded-full px-3 py-1 border-none capitalize">
            {st}
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
            title={<span className="text-gray-700 font-semibold text-base">Weekly Revenue</span>}
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
            title={<span className="text-gray-700 font-semibold text-base">Weekly Bookings</span>}
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
          title={<span className="text-gray-700 font-semibold text-base">Recent Bookings</span>}
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
