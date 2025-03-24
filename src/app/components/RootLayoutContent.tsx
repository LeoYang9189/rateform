"use client";

import { Layout, Menu } from "@arco-design/web-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconFile, IconUser, IconNotification, IconStar } from "@arco-design/web-react/icon";

const { Sider, Content } = Layout;
const MenuItem = Menu.Item;

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <Layout className="h-screen">
      <Sider style={{ width: '280px', backgroundColor: '#001529' }}>
        <div className="text-white p-6 text-2xl font-bold border-b border-gray-700">
          供应商评分系统
        </div>
        <Menu
          style={{
            fontSize: '16px',
            backgroundColor: '#001529',
          }}
          theme="dark"
          selectedKeys={[pathname]}
        >
          <MenuItem key="/">
            <Link href="/" className="flex items-center py-2">
              <IconFile className="mr-3 text-xl" />
              文档说明
            </Link>
          </MenuItem>
          <MenuItem key="/supplier">
            <Link href="/supplier" className="flex items-center py-2">
              <IconUser className="mr-3 text-xl" />
              供应商详情
            </Link>
          </MenuItem>
          <MenuItem key="/notifications">
            <Link href="/notifications" className="flex items-center py-2">
              <IconNotification className="mr-3 text-xl" />
              提醒样例
            </Link>
          </MenuItem>
          <MenuItem key="/evaluation">
            <Link href="/evaluation" className="flex items-center py-2">
              <IconStar className="mr-3 text-xl" />
              供应商评估
            </Link>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Content className="p-8 bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
} 