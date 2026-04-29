import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinFilled,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";
import { Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSettingGeneral } from "../../services/settingGeneralServices";

const { Title, Text } = Typography;

function FooterLayoutClient() {
  const [settingGeneral, setSettingGeneral] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getSettingGeneral();
      if (result && result.data) {
        setSettingGeneral(result.data);
      }
    };
    fetchApi();
  }, []);

  const footerLinks = {
    services: [
      { label: "Tour trong nước", link: "/tours/trong-nuoc" },
      { label: "Tour quốc tế", link: "/tours/quoc-te" },
      { label: "Tour giờ chót", link: "/tours/gio-chot" },
      { label: "Cẩm nang du lịch", link: "/guides" },
    ],
    policies: [
      { label: "Chính sách bảo mật", link: "/privacy" },
      { label: "Điều khoản sử dụng", link: "/terms" },
      { label: "Quy định thanh toán", link: "/payment-policy" },
      { label: "Chính sách hoàn hủy", link: "/refund-policy" },
    ]
  };

  const SocialIcon = ({ icon }) => (
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-text2 transition-all duration-300 cursor-pointer">
      {icon}
    </div>
  );

  return (
    <footer className="bg-[#f8fafc] border-t border-gray-200 pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Title level={3} style={{ margin: 0, color: 'var(--color-text1)', fontSize: '24px', fontWeight: 800 }}>
                {settingGeneral.websiteName || "Booking Tour"}
              </Title>
            </div>

            <p className="text-text1/70 leading-relaxed text-[15px]">
              Chúng tôi mang đến những trải nghiệm du lịch độc đáo, an toàn và đầy cảm hứng cho mọi hành trình của bạn.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 text-text1/80">
                <EnvironmentOutlined className="text-primary mt-1" />
                <span className="text-[14px]">{settingGeneral.address || "123 Đường Du Lịch, Quận 1, TP. Hồ Chí Minh"}</span>
              </div>
              <div className="flex items-center gap-3 text-text1/80">
                <PhoneOutlined className="text-primary" />
                <span className="text-[14px] font-semibold">{settingGeneral.phone || "1900 1234"}</span>
              </div>
              <div className="flex items-center gap-3 text-text1/80">
                <MailOutlined className="text-primary" />
                <span className="text-[14px]">{settingGeneral.email || "contact@travelland.com"}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <Title level={4} className="!text-text1 !font-bold !mb-8">Dịch vụ</Title>
            <ul className="space-y-4 list-none p-0 m-0">
              {footerLinks.services.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="text-text1/70 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <Title level={4} className="!text-text1 !font-bold !mb-8">Chính sách</Title>
            <ul className="space-y-4 list-none p-0 m-0">
              {footerLinks.policies.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="text-text1/70 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social & Payments */}
          <div className="space-y-10">
            <div>
              <Title level={4} className="!text-text1 !font-bold !mb-8">Theo dõi chúng tôi</Title>
              <Space size={16}>
                <SocialIcon icon={<FacebookFilled className="text-xl" />} />
                <SocialIcon icon={<TwitterOutlined className="text-xl" />} />
                <SocialIcon icon={<InstagramOutlined className="text-xl" />} />
                <SocialIcon icon={<LinkedinFilled className="text-xl" />} />
              </Space>
            </div>

            <div>
              <Title level={4} className="!text-text1 !font-bold !mb-6">Phương thức thanh toán</Title>
              <div className="flex flex-wrap gap-3">
                {["Cash", "MoMo", "VNPAY"].map((p) => (
                  <div key={p} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-[12px] font-bold text-text1/50">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <Text className="text-text1/50 text-[14px]">
            © {new Date().getFullYear()} {settingGeneral.websiteName || "Travelland"}. Design by <span className="font-bold text-primary">Nhat Bao</span>.
          </Text>
          <div className="flex gap-8 text-[14px] font-medium">
            <Link to="/" className="text-text1/50 hover:text-primary transition-colors">Trang chủ</Link>
            <Link to="/about" className="text-text1/50 hover:text-primary transition-colors">Về chúng tôi</Link>
            <Link to="/contact" className="text-text1/50 hover:text-primary transition-colors">Liên hệ</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default FooterLayoutClient;