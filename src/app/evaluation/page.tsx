"use client";

import {
  Card,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Space,
  Grid,
  Table,
  Tag,
  Tabs,
  DatePicker,
} from "@arco-design/web-react";
import type { ColumnProps } from '@arco-design/web-react/es/Table/interface';
import { IconSearch, IconRefresh } from "@arco-design/web-react/icon";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EvaluationConfirmModal } from "../components/EvaluationConfirmModal";

const { Title } = Typography;
const FormItem = Form.Item;
const { Row, Col } = Grid;
const TabPane = Tabs.TabPane;

// 生成模拟数据的函数
const generateMockData = () => {
  const suppliers = [
    "上海科技有限公司", "北京智能制造股份有限公司", "广州电子科技有限公司",
    "深圳数字科技有限公司", "杭州网络科技有限公司", "南京软件开发有限公司",
    "重庆智能装备有限公司", "武汉数据科技有限公司", "成都互联网科技有限公司",
    "西安芯片技术有限公司"
  ];
  const creators = ["张三", "李四", "王五", "赵六", "钱七"];
  const departments = ["采购部", "质量部", "研发部", "生产部"];
  
  const getRandomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const data: TableItem[] = [];
  const today = new Date();
  
  // 先生成两条逾期待评估的数据
  for (let i = 0; i < 2; i++) {
    const createDate = formatDate(getRandomDate(new Date('2024-01-01'), today));
    const isShared = Math.random() > 0.7;
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const sharedFrom = isShared 
      ? `${creators[Math.floor(Math.random() * creators.length)]} | ${departments[Math.floor(Math.random() * departments.length)]}` 
      : null;

    const status = '逾期待评估';
    const deadline = formatDate(getRandomDate(new Date('2024-01-01'), today));
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    data.push({
      key: String(i + 1),
      supplierName: suppliers[i % suppliers.length] + (Math.floor(i / suppliers.length) > 0 ? ` (${Math.floor(i / suppliers.length) + 1})` : ''),
      status,
      createDate,
      creator,
      deadline,
      daysLeft,
      source: isShared ? '他人共享' : '我创建的',
      sharedFrom,
      completionDate: null,
    });
  }

  // 生成剩余数据
  for (let i = 2; i < 50; i++) {
    const createDate = formatDate(getRandomDate(new Date('2024-01-01'), today));
    const isShared = Math.random() > 0.7;
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const sharedFrom = isShared 
      ? `${creators[Math.floor(Math.random() * creators.length)]} | ${departments[Math.floor(Math.random() * departments.length)]}` 
      : null;

    // 根据随机数决定状态
    const statusRandom = Math.random();
    let status: string;
    let deadline: string;
    let daysLeft: number | null;
    let completionDate: string | null = null;

    if (statusRandom < 0.3) {
      // 30% 已完成
      status = '已完成';
      deadline = formatDate(getRandomDate(new Date('2024-01-01'), today));
      daysLeft = null;
      completionDate = formatDate(getRandomDate(new Date(createDate), new Date(deadline)));
    } else if (statusRandom < 0.4) {
      // 10% 逾期待评估
      status = '逾期待评估';
      deadline = formatDate(getRandomDate(new Date('2024-01-01'), today));
      const deadlineDate = new Date(deadline);
      daysLeft = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      // 60% 待评估
      status = '待评估';
      deadline = formatDate(getRandomDate(new Date('2025-05-01'), new Date('2025-12-31')));
      const deadlineDate = new Date(deadline);
      daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    data.push({
      key: String(i + 1),
      supplierName: suppliers[i % suppliers.length] + (Math.floor(i / suppliers.length) > 0 ? ` (${Math.floor(i / suppliers.length) + 1})` : ''),
      status,
      createDate,
      creator,
      deadline,
      daysLeft,
      source: isShared ? '他人共享' : '我创建的',
      sharedFrom,
      completionDate,
    });
  }
  return data;
};

// 生成50条模拟数据
const mockData = generateMockData();

interface TableItem {
  key: string;
  supplierName: string;
  status: string;
  createDate: string;
  creator: string;
  deadline: string;
  daysLeft: number | null;
  source: string;
  sharedFrom: string | null;
  completionDate: string | null;
}

export default function EvaluationPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: mockData.length,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<TableItem | null>(null);

  // 根据Tab筛选数据
  const filteredData = useMemo(() => {
    let filtered = [...mockData];
    
    // 根据Tab筛选
    if (activeTab === 'pending') {
      filtered = filtered.filter(item => ['待评估', '逾期待评估'].includes(item.status));
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(item => item.status === '已完成');
    }

    return filtered;
  }, [activeTab]);

  // 处理分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, pagination.current, pagination.pageSize]);

  const handleSearch = () => {
    console.log('搜索条件:', form.getFields());
  };

  const handleReset = () => {
    form.resetFields();
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; }> = {
      '待评估': { color: 'orange' },
      '逾期待评估': { color: 'red' },
      '已完成': { color: 'green' },
    };
    return <Tag color={statusConfig[status]?.color}>{status}</Tag>;
  };

  // 处理查看按钮点击
  const handleView = (record: TableItem) => {
    router.push(`/evaluation/form?mode=view&id=${record.key}`);
  };

  // 处理评估按钮点击
  const handleEvaluate = (record: TableItem) => {
    setSelectedSupplier(record);
    setModalVisible(true);
  };

  const columns: ColumnProps<TableItem>[] = [
    {
      title: '供应商名称',
      dataIndex: 'supplierName',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      width: 120,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
    },
    {
      title: '评估截止日期',
      dataIndex: 'deadline',
      width: 120,
    },
    {
      title: '剩余天数',
      dataIndex: 'daysLeft',
      width: 100,
      render: (days: number | null) => {
        if (days === null) return '-';
        if (days < 0) return <span style={{ color: 'red' }}>{Math.abs(days)}天(已逾期)</span>;
        return `${days}天`;
      },
    },
    {
      title: '评估来源',
      dataIndex: 'source',
      width: 120,
    },
    {
      title: '共享来源',
      dataIndex: 'sharedFrom',
      width: 150,
      render: (text: string | null) => text || '-',
    },
    {
      title: '完成评估时间',
      dataIndex: 'completionDate',
      width: 120,
      render: (text: string | null) => text || '-',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_: unknown, record: TableItem) => (
        <Space>
          <Button 
            type="text" 
            size="small"
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {(record.status === '待评估' || record.status === '逾期待评估') && (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleEvaluate(record)}
            >
              立即评估
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title heading={2} style={{ marginBottom: 32 }}>供应商评估</Title>

      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="horizontal"
          style={{ width: '100%' }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="供应商名称" field="supplierName">
                <Input placeholder="请输入供应商名称" allowClear />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="状态" field="status">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  options={[
                    { label: '待评估', value: 'pending' },
                    { label: '逾期待评估', value: 'overdue' },
                    { label: '已完成', value: 'completed' },
                  ]}
                />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="评估来源" field="source">
                <Select
                  placeholder="请选择评估来源"
                  allowClear
                  options={[
                    { label: '我创建的', value: 'self' },
                    { label: '他人共享', value: 'shared' },
                  ]}
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label="创建日期" field="createDate">
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="评估截止日期" field="deadline">
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </FormItem>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 24 }}>
              <Space>
                <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
                  搜索
                </Button>
                <Button icon={<IconRefresh />} onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabPane key="all" title={`全部 (${mockData.length})`} />
          <TabPane key="pending" title={`待评估 (${mockData.filter(item => ['待评估', '逾期待评估'].includes(item.status)).length})`} />
          <TabPane key="completed" title={`已完成 (${mockData.filter(item => item.status === '已完成').length})`} />
        </Tabs>

        <Table
          columns={columns}
          data={paginatedData}
          scroll={{ x: 1500 }}
          pagination={{
            ...pagination,
            total: filteredData.length,
            showTotal: true,
            onChange: (pageNumber, pageSize) => {
              setPagination({ ...pagination, current: pageNumber, pageSize });
            },
          }}
          style={{ marginTop: 24 }}
        />
      </Card>

      <EvaluationConfirmModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        supplierName={selectedSupplier?.supplierName || ''}
      />
    </div>
  );
} 