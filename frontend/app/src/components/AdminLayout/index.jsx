import React from 'react';
import {
  AppstoreOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ProfileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, ConfigProvider, Avatar } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Content, Sider } = Layout;

// Define custom theme for the Menu to match the reference image
const menuTheme = {
  components: {
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'var(--color-primary)', // Red/Orange active state
      darkItemColor: '#9ca3af', // Gray text for inactive (Tailwind gray-400)
      darkItemSelectedColor: 'var(--color-text2)', // White text
      darkItemHoverColor: 'var(--color-text2)',
      darkItemHoverBg: 'rgba(255,255,255,0.08)',
      itemBorderRadius: 8,
      itemMarginInline: 16,
      itemHeight: 48,
    },
  },
};

const items = [
  {
    key: '/admin',
    icon: <AppstoreOutlined className="text-lg" />,
    label: <span className="font-medium">Tổng quan</span>,
  },
  {
    key: '/admin/tours',
    icon: <EnvironmentOutlined className="text-lg" />,
    label: <span className="font-medium">Tours</span>,
  },
  {
    key: '/admin/bookings',
    icon: <ProfileOutlined className="text-lg" />,
    label: <span className="font-medium">Bookings</span>,
  },
  {
    key: '/admin/schedule',
    icon: <CalendarOutlined className="text-lg" />,
    label: <span className="font-medium">Schedules</span>,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className="min-h-screen">
      <Sider
        width={260}
        style={{ background: 'var(--color-text1)' }}
      >
        <div className="flex flex-col h-full">

          {/* Top Logo Section */}
          <div className="p-6 pb-4 flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold m-0 leading-tight" style={{ color: 'var(--color-text2)' }}>
                Travelland
              </h1>
              <p className="text-gray-400 text-xs m-0 mt-0.5 font-medium">
                Admin System
              </p>
            </div>
          </div>

          {/* Menu Section */}
          <div className="flex-1 mt-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <ConfigProvider theme={menuTheme}>
              <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={({ key }) => navigate(key)}
                style={{ background: 'transparent', border: 'none' }}
              />
            </ConfigProvider>
          </div>

          {/* User Profile Section at Bottom */}
          <div className="p-5 flex items-center gap-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Avatar
              size={42}
              icon={<UserOutlined />}
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-text2)' }}
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sm" style={{ color: 'var(--color-text2)' }}>Admin User</span>
              <span className="text-gray-400 text-xs mt-0.5">admin@bookingtour.com</span>
            </div>
          </div>

        </div>
      </Sider>

      {/* Main layout container with restored Outlet */}
      <Layout>
        <Content className="m-6 p-6 shadow-sm rounded-lg" style={{ background: 'var(--color-background)', overflow: 'initial' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;