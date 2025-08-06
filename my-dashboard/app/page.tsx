'use client';
import { Layout } from 'antd';
import TimelineSlider from '@/components/TimelineSlider';
import 'antd/dist/reset.css';
import dynamic from 'next/dynamic';

const { Header, Content, Sider } = Layout;

// Dynamically import Map and Sidebar, disabling server-side rendering (SSR)
const DynamicMap = dynamic(() => import('@/components/Map'), { ssr: false });
const DynamicSidebar = dynamic(() => import('@/components/Sidebar'), { ssr: false });

export default function Home() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TimelineSlider />
      </Header>
      <Layout>
        <Sider width={350} style={{ background: '#f0f2f5', padding: '16px', overflowY: 'auto' }}>
          <DynamicSidebar />
        </Sider>
        <Content>
          <DynamicMap />
        </Content>
      </Layout>
    </Layout>
  );
}