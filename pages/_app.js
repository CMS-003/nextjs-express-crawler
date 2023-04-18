import React from 'react';
import { useRouter } from 'next/router'
import { Layout, Menu, theme } from 'antd';
import { Observer, useLocalObservable, } from 'mobx-react-lite';
import { AiOutlineHistory, AiOutlineBug, AiOutlineTrademark } from 'react-icons/ai'
import "antd/dist/reset.css";
import "fe/styles/globals.css"

const { Header, Content, Footer, Sider } = Layout;
const MenuItems = [
  { name: '/records', title: '记录', icon: <AiOutlineHistory />, path: '/records' },
  { name: '/rules', title: '规则', icon: <AiOutlineBug />, path: '/rules' },
  { name: '/resources', title: '资源', icon: <AiOutlineTrademark />, path: '/resources' }
]

function SelfLayout({ children }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const router = useRouter()

  const local = useLocalObservable(() => ({
    currentKey: router.pathname
  }));
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
      <Observer>{() => (
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[local.currentKey]}
          onSelect={({ item, key, keyPath, selectedKeys, }) => {
            local.currentKey = key;
          }}
          items={MenuItems.map(
            (item, index) => ({
              key: item.name,
              icon: item.icon,
              label: <span onClick={() => {
                local.currentKey = item.name;
                router.push(item.path)
              }}>{item.title}</span>,
            }),
          )}
        />
      )}</Observer>
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
