import React from 'react';
import App, { Container } from "next/app";;
import Link from "next/link"
import { Layout, Menu, theme } from 'antd';
import { HistoryOutlined, BugOutlined, TrademarkOutlined } from '@ant-design/icons';
import "antd/dist/reset.css";
import "fe/styles/globals.css"

const { Header, Content, Footer, Sider } = Layout;
const MenuItems = [
  { name: 'records', title: '记录', icon: <HistoryOutlined size={32} />, path: '/records' },
  { name: 'rules', title: '规则', icon: <BugOutlined />, path: '/rules' },
  { name: 'resources', title: '资源', icon: <TrademarkOutlined />, path: '/resources' }
]

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
        items={MenuItems.map(
          (item, index) => ({
            key: item.name,
            icon: item.icon,
            label: <Link target="_self" href={item.path}>{item.title}</Link>,
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

export default function MyApp({ Component, pageProps }) {
  return (
    <SelfLayout>
      <Component {...pageProps} />
    </SelfLayout>
  )
}
