import React from 'react';
import {
  AppstoreOutlined,
  EnvironmentOutlined,
  ProfileOutlined,
  UserOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { Layout, Menu, ConfigProvider, Avatar, message, Button, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { doLogout, getUserInfo } from '../../redux/actions/accountAction';
import { getCookie } from '../../utils/cookie';




const { Content, Sider } = Layout;

// Define custom theme for the Menu to match the reference image
const menuTheme = {
  components: {
    Menu: {
      darkItemBg: 'transparent',
      darkItemSelectedBg: 'var(--color-primary)',
      darkItemColor: '#9ca3af',
      darkItemSelectedColor: 'var(--color-text2)',
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
    key: '/admin/categories',
    icon: <TagOutlined className="text-lg" />,
    label: <span className="font-medium">Quản lý danh mục</span>,
  },
  {
    key: '/admin/tours',
    icon: <EnvironmentOutlined className="text-lg" />,
    label: <span className="font-medium">Quản lý tour du lịch</span>,
  },
  {
    key: '/admin/orders',
    icon: <ProfileOutlined className="text-lg" />,
    label: <span className="font-medium">Quản lý đơn</span>,
  },
  {
    key: '/admin/accounts',
    icon: <UserOutlined className="text-lg" />,
    label: <span className="font-medium">Quản lý tài khoản</span>,
  },
  {
    key: '/admin/roles',
    icon: <SafetyCertificateOutlined className="text-lg" />,
    label: <span className="font-medium">Quản lý quyền</span>,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const adminInfo = useSelector((state) => state.account.userInfo);

  React.useEffect(() => {
    const token = getCookie('accessToken');
    if (token && !adminInfo?.userName) {
      dispatch(getUserInfo());
    }
  }, [dispatch, adminInfo]);

  const handleLogout = async () => {
    try {
      const result = await dispatch(doLogout());
      if (result) {
        message.success(result.message);
      }
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Lỗi khi đăng xuất');
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={260}
        style={{
          background: 'var(--color-text1)',
          overflow: 'hidden',
          height: '100vh',
          position: 'sticky',
          top: 0,
          left: 0,
        }}
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
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-semibold text-sm truncate" style={{ color: 'var(--color-text2)' }}>
                {adminInfo?.userName}
              </span>
              <span className="text-gray-400 text-xs mt-0.5 truncate">
                {adminInfo?.email}
              </span>
              <span className="text-gray-400 text-xs mt-0.5 truncate">
                {adminInfo?.role.title}
              </span>
            </div>
            <Tooltip title="Đăng xuất">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ color: 'var(--color-text2)', opacity: 0.7 }}
                className="hover:opacity-100 transition-opacity"
              />
            </Tooltip>
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