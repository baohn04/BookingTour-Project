import { Layout } from "antd";
import { ScrollRestoration } from "react-router-dom";
import HeaderLayoutClient from "./HeaderLayoutClient";
import MainLayoutClient from "./MainLayoutClient";
import FooterLayoutClient from "./FooterLayoutClient";
import FloatingActionButtons from "../FloatingActionButtons";
import RecentBookingNotification from "../RecentBookingNotification";

const { Header, Content, Footer } = Layout;

function LayoutDefault() {
  return (
    <Layout className="min-h-screen !bg-background relative">
      <ScrollRestoration />
      <Header className="!p-0 !h-auto !bg-transparent !leading-normal sticky top-0 z-50">
        <HeaderLayoutClient />
      </Header>

      <Content className="!bg-background flex flex-col">
        <MainLayoutClient />
      </Content>

      <Footer className="!p-0 !bg-transparent">
        <FooterLayoutClient />
      </Footer>

      <FloatingActionButtons />
      <RecentBookingNotification />
    </Layout>
  );
}

export default LayoutDefault;