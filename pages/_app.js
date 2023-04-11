import React from 'react';
import App, { Container } from "next/app";;
import { Layout, Menu, theme } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import "fe/styles/globals.css"

const { Header, Content, Footer, Sider } = Layout;

function SelfLayout({ children }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (<Layout style={{ height: '100%' }}>
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['4']}
        items={[UserOutlined, VideoCameraOutlined, UploadOutlined, UserOutlined].map(
          (icon, index) => ({
            key: String(index + 1),
            icon: React.createElement(icon),
            label: `nav ${index + 1}`,
          }),
        )}
      />
    </Sider>
    <Layout>
      <Header style={{ padding: 0, background: colorBgContainer }} />
      <Content>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  </Layout>)
}

class Crawler extends App {

  render() {
    let { Component } = this.props;
    return (
      <SelfLayout>
        <Component />
      </SelfLayout>
    );
  }
}
export default Crawler;