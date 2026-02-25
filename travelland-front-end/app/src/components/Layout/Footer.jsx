import {
  FacebookFilled,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinFilled,
  AppleFilled,
  AndroidFilled
} from "@ant-design/icons";
import { Input, Button, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSettingGeneral } from "../../services/settingGeneralServices";

const { Title, Text } = Typography;

function Footer() {
  const [settingGeneral, setSettingGeneral] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getSettingGeneral();
      setSettingGeneral(result.data);
    };
    fetchApi();
  }, []);
  const footerLinks = {
    company: [
      { label: "About Us", link: "/about" },
      { label: "Tourz Reviews", link: "/reviews" },
      { label: "Contact Us", link: "/contact" },
      { label: "Travel Guides", link: "/guides" },
      { label: "Data Policy", link: "/privacy" },
      { label: "Cookie Policy", link: "/cookies" },
      { label: "Legal", link: "/legal" },
      { label: "Sitemap", link: "/sitemap" },
    ],
    support: [
      { label: "Get in Touch", link: "/contact" },
      { label: "Help center", link: "/help" },
      { label: "Live chat", link: "/chat" },
      { label: "How it works", link: "/how-it-works" },
    ]
  };

  const SocialIcon = ({ icon }) => (
    <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-text1 hover:bg-primary hover:text-text2 transition-all cursor-pointer">
      {icon}
    </div>
  );

  return (
    <footer className="bg-background border-t border-text2 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: Contact & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-12 border-b border-text2 mb-12 gap-6">
          <div className="flex items-center gap-2">
            <Text className="text-lg text-text1">Số điện thoại:</Text>
            <Text className="text-xl font-bold text-primary">{settingGeneral.phone}</Text>
          </div>

          <div className="flex items-center gap-4">
            <Text className="font-semibold text-text1">Theo dõi chúng tôi</Text>
            <Space size={12}>
              <SocialIcon icon={<FacebookFilled />} />
              <SocialIcon icon={<TwitterOutlined />} />
              <SocialIcon icon={<InstagramOutlined />} />
              <SocialIcon icon={<LinkedinFilled />} />
            </Space>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Column 1: Contact */}
          <div className="space-y-6">
            <Title level={4} style={{ margin: 0 }}>Contact</Title>
            <div className="space-y-4">
              <p className="text-text1 leading-relaxed">
                {settingGeneral.address || "328 Queensberry Street, North Melbourne VIC3051, Australia."}
              </p>
              <div>
                <a href={settingGeneral.email ? `mailto:${settingGeneral.email}` : "mailto:hi@viatours.com"} className="text-text1 font-medium hover:text-primary transition-colors">
                  {settingGeneral.email || "hi@viatours.com"}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: '24px' }}>Company</Title>
            <ul className="space-y-3 list-none p-0 m-0">
              {footerLinks.company.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="text-text1 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: '24px' }}>Support</Title>
            <ul className="space-y-3 list-none p-0 m-0">
              {footerLinks.support.map((item, index) => (
                <li key={index}>
                  <Link to={item.link} className="text-text1 hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Apps */}
          <div className="space-y-8">
            {/* Newsletter */}
            <div>
              <Title level={4} style={{ margin: 0, marginBottom: '16px' }}>Newsletter</Title>
              <p className="text-text1 mb-4">
                Subscribe to the free newsletter and stay up to date
              </p>
              <div className="relative">
                <Input
                  placeholder="Your email address"
                  className="rounded-xl py-3 px-4 bg-background border-text2 hover:border-text2 focus:border-primary focus:shadow-none pr-16"
                />
                <Button
                  type="text"
                  className="absolute right-1 top-1 bottom-1 font-semibold text-text1 hover:text-primary hover:bg-transparent"
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Mobile Apps */}
            <div>
              <Title level={4} style={{ margin: 0, marginBottom: '16px' }}>Mobile Apps</Title>
              <div className="space-y-3">
                <Link to="#" className="flex items-center gap-2 text-text1 hover:text-primary transition-colors">
                  <AppleFilled className="text-xl" />
                  <span>iOS App</span>
                </Link>
                <Link to="#" className="flex items-center gap-2 text-text1 hover:text-primary transition-colors">
                  <AndroidFilled className="text-xl" />
                  <span>Android App</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright (Optional but recommended) */}
        <div className="mt-16 pt-8 border-t border-text2 flex flex-col md:flex-row justify-between items-center gap-4">
          <Text className="text-text1">© {new Date().getFullYear()} Copyright: {settingGeneral.copyright || settingGeneral.websiteName || "Travelland"}. All rights reserved.</Text>
          <div className="flex gap-6 text-text1">
            <Link to="#" className="hover:text-text1">Privacy</Link>
            <Link to="#" className="hover:text-text1">Terms</Link>
            <Link to="#" className="hover:text-text1">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;