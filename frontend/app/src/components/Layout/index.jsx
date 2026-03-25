import { Layout } from "antd";
import { ScrollRestoration } from "react-router-dom";
import AppHeader from "./Header";
import AppFooter from "./Footer";
import Main from "./Main";
import FloatingActions from "../FloatingActions";
import PopupOrder from "../PopupOrder";

const { Header, Content, Footer } = Layout;

function LayoutDefault() {
  return (
    <Layout className="min-h-screen !bg-background relative">
      <ScrollRestoration />
      <Header className="!p-0 !h-auto !bg-transparent !leading-normal sticky top-0 z-50">
        <AppHeader />
      </Header>

      <Content className="!bg-background flex flex-col">
        <Main />
      </Content>

      <Footer className="!p-0 !bg-transparent">
        <AppFooter />
      </Footer>

      <FloatingActions />
      <PopupOrder />
    </Layout>
  );
}

export default LayoutDefault;