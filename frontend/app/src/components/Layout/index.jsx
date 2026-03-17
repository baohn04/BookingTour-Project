import { Layout } from "antd";
import AppHeader from "./Header";
import AppFooter from "./Footer";
import Main from "./Main";
import FloatingActions from "../FloatingActions";

const { Header, Content, Footer } = Layout;

function LayoutDefault() {
  return (
    <Layout className="min-h-screen !bg-background relative">
      <Header className="!p-0 !h-auto !bg-transparent !leading-normal z-50">
        <AppHeader />
      </Header>

      <Content className="!bg-background flex flex-col">
        <Main />
      </Content>

      <Footer className="!p-0 !bg-transparent">
        <AppFooter />
      </Footer>

      <FloatingActions />
    </Layout>
  );
}

export default LayoutDefault;