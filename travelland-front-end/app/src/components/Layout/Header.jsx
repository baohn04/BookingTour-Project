import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Badge,
  Space,
  Drawer,
  Menu,
  Typography,
  Dropdown
} from "antd";
import {
  SearchOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getSettingGeneral } from "../../services/settingGeneralServices";

const { Text } = Typography;

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingGeneral, setSettingGeneral] = useState({});
  const [currentLang, setCurrentLang] = useState('vi');

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getSettingGeneral();
      setSettingGeneral(result.data);
    };
    fetchApi();
  }, []);

  const languageItems = [
    {
      key: 'vi',
      label: (
        <Space>
          <img src="https://flagcdn.com/w20/vn.png" srcSet="https://flagcdn.com/w40/vn.png 2x" alt="Vietnamese" className="w-5 h-auto rounded-[2px]" />
          Tiếng Việt
        </Space>
      ),
      onClick: () => setCurrentLang('vi')
    },
    {
      key: 'en',
      label: (
        <Space>
          <img src="https://flagcdn.com/w20/us.png" srcSet="https://flagcdn.com/w40/us.png 2x" alt="English" className="w-5 h-auto rounded-[2px]" />
          English
        </Space>
      ),
      onClick: () => setCurrentLang('en')
    },
  ];

  const mobileMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/" onClick={() => setMobileMenuOpen(false)}>Trang Chủ</Link>,
    },
    {
      key: 'categories',
      icon: <AppstoreOutlined />,
      label: <Link to="/categories" onClick={() => setMobileMenuOpen(false)}>Loại Tour</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'cart',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Giỏ Hàng</Link>,
    }
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-4">
      <div className="max-w-7xl mx-auto py-3">
        <Row align="middle" justify="space-between" gutter={[16, 12]}>
          {/* Logo */}
          <Col xs={12} sm={8} md={6} lg={5} xl={4}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Space align="center" size={8}>
                <img src={settingGeneral.logo} alt="Logo" className="max-h-20 w-auto object-contain rounded-md" />
                <Text className="text-[22px] font-bold text-orange-500 ml-2">{settingGeneral.websiteName}</Text>
              </Space>
            </Link>
          </Col>

          {/* Search Bar */}
          <Col xs={0} sm={8} md={10} lg={10} xl={11}>
            <Input
              placeholder="Tìm kiếm tour du lịch..."
              prefix={<SearchOutlined className="text-gray-400" />}
              size="large"
              className="rounded-3xl bg-gray-50 border-gray-200 hover:bg-white focus:bg-white"
            />
          </Col>

          {/* Desktop Navigation */}
          <Col xs={0} sm={0} md={8} lg={8} xl={8}>
            <Row justify="end" align="middle">
              <Space size={12}>
                {/* Home */}
                <Link to="/">
                  <Button type="text" className="font-medium text-gray-600 hover:text-primary border-none shadow-none" icon={<HomeOutlined />}>
                    Trang Chủ
                  </Button>
                </Link>

                {/* Tour Types */}
                <Link to="/categories">
                  <Button type="text" className="font-medium text-gray-600 hover:text-primary border-none shadow-none" icon={<AppstoreOutlined />}>
                    Loại Tour
                  </Button>
                </Link>

                {/* Cart */}
                <Link to="/cart">
                  <Badge count={0} showZero={false}>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      className="rounded-full font-medium px-5 bg-gradient-to-br from-primary to-primary-hover border-none shadow-md shadow-primary/30 hover:opacity-90"
                    >
                      Giỏ Hàng
                    </Button>
                  </Badge>
                </Link>

                {/* Language Switcher */}
                <Dropdown menu={{ items: languageItems }} placement="bottomRight" trigger={['click']}>
                  <Button type="text" className="font-medium text-gray-600 hover:text-primary border-none shadow-none flex items-center gap-2">
                    {currentLang === 'vi'
                      ? <img src="https://flagcdn.com/w20/vn.png" srcSet="https://flagcdn.com/w40/vn.png 2x" alt="Vietnamese" className="w-5 h-auto rounded-[2px]" />
                      : <img src="https://flagcdn.com/w20/us.png" srcSet="https://flagcdn.com/w40/us.png 2x" alt="English" className="w-5 h-auto rounded-[2px]" />
                    }
                    <span className="uppercase">{currentLang}</span>
                  </Button>
                </Dropdown>
              </Space>
            </Row>
          </Col>

          {/* Responsive*/}
          <Col xs={12} sm={8} md={0}>
            <Row justify="end" align="middle">
              <Space size={4}>
                {/* Language Switcher Mobile */}
                <Dropdown menu={{ items: languageItems }} placement="bottomRight" trigger={['click']}>
                  <Button
                    type="text"
                    className="border-none shadow-none px-2 text-gray-600 hover:text-primary flex items-center justify-center p-0 h-[40px]"
                  >
                    {currentLang === 'vi'
                      ? <img src="https://flagcdn.com/w40/vn.png" alt="Vietnamese" className="w-[26px] h-auto rounded-[3px] shadow-sm transform scale-[1.1]" />
                      : <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-[26px] h-auto rounded-[3px] shadow-sm transform scale-[1.1]" />
                    }
                  </Button>
                </Dropdown>

                {/* Cart Icon */}
                <Link to="/cart">
                  <Badge count={0} showZero={false}>
                    <Button
                      type="text"
                      icon={<ShoppingCartOutlined style={{ fontSize: 20 }} />}
                      className="border-none shadow-none px-2 text-gray-600 hover:text-primary"
                    />
                  </Badge>
                </Link>

                {/* Menu Button */}
                <Button
                  type="text"
                  icon={<MenuOutlined style={{ fontSize: 20 }} />}
                  onClick={() => setMobileMenuOpen(true)}
                  className="border-none shadow-none px-2 text-gray-600 hover:text-primary"
                />
              </Space>
            </Row>
          </Col>

          {/* Responsive Search */}
          <Col xs={24} sm={0}>
            <Input
              placeholder="Search destinations or activities"
              prefix={<SearchOutlined className="text-gray-400" />}
              size="middle"
              className="rounded-3xl bg-gray-50 border-gray-200"
            />
          </Col>
        </Row>
      </div>

      {/* Responsive Drawer Menu */}
      <Drawer
        title={
          <Space align="center" size={8}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-md">
              <img src={settingGeneral.logo} alt="Logo" className="max-h-20 w-auto object-contain rounded-md" />
            </div>
            <Text strong className="text-lg">{settingGeneral.websiteName}</Text>
          </Space>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          items={mobileMenuItems}
          className="border-none"
          selectable={false}
        />
      </Drawer>
    </header>
  );
}

export default Header;