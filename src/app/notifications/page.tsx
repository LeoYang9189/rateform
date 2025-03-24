"use client";

import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Checkbox,
  Alert,
} from "@arco-design/web-react";
import {
  IconExclamationCircle,
  IconCalendar,
  IconApps,
  IconClockCircle,
} from "@arco-design/web-react/icon";
import { useRouter } from "next/navigation";

const { Title } = Typography;

// 模拟数据
const supplierData = [
  {
    key: "1",
    name: "上海科技有限公司",
    deadline: "2024-04-30",
    daysLeft: 15,
  },
  {
    key: "2",
    name: "北京智能制造股份有限公司",
    deadline: "2024-05-05",
    daysLeft: 20,
  },
  {
    key: "3",
    name: "广州电子科技有限公司",
    deadline: "2024-04-25",
    daysLeft: 10,
  },
];

const columns = [
  {
    title: (
      <Space>
        <IconApps style={{ fontSize: 16 }} />
        供应商名称
      </Space>
    ),
    dataIndex: "name",
    render: (text: string) => (
      <span style={{ fontSize: '16px', color: 'var(--color-text-2)' }}>{text}</span>
    ),
  },
  {
    title: (
      <Space>
        <IconCalendar style={{ fontSize: 16 }} />
        评估截止日期
      </Space>
    ),
    dataIndex: "deadline",
    render: (text: string) => (
      <span style={{ fontSize: '16px', color: 'var(--color-text-2)' }}>{text}</span>
    ),
  },
  {
    title: (
      <Space>
        <IconClockCircle style={{ fontSize: 16 }} />
        剩余天数
      </Space>
    ),
    dataIndex: "daysLeft",
    render: (days: number) => (
      <span style={{ 
        fontSize: '16px',
        color: days <= 15 ? 'var(--color-danger-light-4)' : 'var(--color-text-2)',
        fontWeight: days <= 15 ? 600 : 400
      }}>
        {days}天
      </span>
    ),
  },
];

export default function NotificationsPage() {
  const router = useRouter();

  const handleEvaluate = () => {
    router.push('/evaluation');
  };

  return (
    <div>
      <Title heading={2} style={{ color: "rgb(var(--red-6))", marginBottom: 32, fontSize: '24px' }}>
        【此处为提醒样例 页面】
      </Title>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Card
          style={{
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            borderRadius: '8px',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <Space align="start">
              <IconExclamationCircle 
                style={{ 
                  fontSize: 24, 
                  color: 'rgb(var(--warning-6))',
                  marginTop: 4
                }} 
              />
              <div>
                <Title heading={3} style={{ marginBottom: 16, fontSize: '20px' }}>
                  供应商评估提醒
                </Title>
                <Alert
                  type="warning"
                  content={
                    <span style={{ fontSize: '16px', color: 'var(--color-text-2)' }}>
                      您有以下供应商已进入年度评估倒计时，如未在截止日期之前完成评估，该供应商将被锁定，无法使用，请尽快处理。
                    </span>
                  }
                  style={{ marginBottom: 24, backgroundColor: 'var(--color-warning-light-1)' }}
                />
              </div>
            </Space>
          </div>

          <Table
            columns={columns}
            data={supplierData}
            border={false}
            style={{ marginBottom: 24 }}
            className="custom-table"
          />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 24
          }}>
            <Checkbox style={{ fontSize: '14px' }}>不再提醒</Checkbox>
            <Space>
              <Button 
                size="large"
                style={{ fontSize: '16px', padding: '0 24px' }}
              >
                取消
              </Button>
              <Button 
                type="primary" 
                size="large"
                style={{ fontSize: '16px', padding: '0 24px' }}
                onClick={handleEvaluate}
              >
                立即评估
              </Button>
            </Space>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        .custom-table .arco-table-th {
          font-size: 16px;
          background-color: var(--color-fill-2);
        }
        .custom-table .arco-table-td {
          padding: 16px 8px;
        }
      `}</style>
    </div>
  );
} 