"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Radio,
  Button,
  Space,
  Table,
  DatePicker,
  Modal,
  Spin
} from "@arco-design/web-react";
import { ColumnProps } from "@arco-design/web-react/es/Table/interface";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from 'dayjs';

const { Title } = Typography;
const FormItem = Form.Item;

interface EvaluationItem {
  id: number;
  item: string;
  standard: string;
  criteria: {
    score100: string;
    score80: string;
    score60: string;
    score0: string;
  };
  maxScore: number;
  score?: number;
}

const evaluationItems: EvaluationItem[] = [
  {
    id: 1,
    item: "服务价格",
    standard: "服务价格有优势",
    criteria: {
      score100: "低于市场价格",
      score80: "基本与市场价格持平",
      score60: "略高于市场价格",
      score0: "高于市场价格10%以上"
    },
    maxScore: 15
  },
  {
    id: 2,
    item: "交货质量",
    standard: "准确无误交货、无质量问题，或准确无误提供服务",
    criteria: {
      score100: "准确无误",
      score80: "出现问题1次",
      score60: "出现问题3次",
      score0: "出现问题5次"
    },
    maxScore: 15
  },
  {
    id: 3,
    item: "交货准时性",
    standard: "是否及时准确提供服务",
    criteria: {
      score100: "100%",
      score80: "90%-99%",
      score60: "80%-89%",
      score0: "<80%"
    },
    maxScore: 10
  },
  {
    id: 4,
    item: "付款期",
    standard: "给予的付款期限",
    criteria: {
      score100: ">30天",
      score80: ">15天",
      score60: ">7天",
      score0: "<7"
    },
    maxScore: 7
  },
  {
    id: 5,
    item: "信息反馈速度",
    standard: "信息及时反馈、沟通及时性",
    criteria: {
      score100: "1小时内反馈",
      score80: "1天内反馈",
      score60: "3天内反馈",
      score0: "超过3天"
    },
    maxScore: 7
  },
  {
    id: 6,
    item: "账单、资料是否完备",
    standard: "账单清晰准确、资料齐全，如有异常费用均事先确认",
    criteria: {
      score100: "账单清晰无错误",
      score80: "3票以内错误，未造成损失",
      score60: "5票以内错误，未造成损失",
      score0: "5票以上错误未造成损失或者账单错误导致我司漏收、少收、错收"
    },
    maxScore: 7
  },
  {
    id: 7,
    item: "人员素质",
    standard: "专业性强、素质高",
    criteria: {
      score100: "专业性强、态度好,有求必应",
      score80: "态度尚可，专业性较好，基本满足",
      score60: "专业性和态度一般",
      score0: "专业性和态度差，响应慢"
    },
    maxScore: 7
  },
  {
    id: 8,
    item: "服务安全性",
    standard: "有完整的安全管理规定，安全管控严格，未发生安全事故",
    criteria: {
      score100: "无任何安全事故",
      score80: "有隐患",
      score60: "有较大隐患",
      score0: "发生安全事故"
    },
    maxScore: 10
  },
  {
    id: 9,
    item: "质量改进完成情况",
    standard: "提出意见后，及时完成改进",
    criteria: {
      score100: "100%/或无需改进",
      score80: "90%-99%",
      score60: "80%-89%",
      score0: "<80%"
    },
    maxScore: 7
  },
  {
    id: 10,
    item: "服务创新性",
    standard: "在基础服务上，能不断创新，满足我司采购需求",
    criteria: {
      score100: "符合我司需求90%以上",
      score80: "符合我司需求80%-89%",
      score60: "符合我司需求60%-70%",
      score0: "符合我司需求60%以下"
    },
    maxScore: 7
  },
  {
    id: 11,
    item: "售后服务",
    standard: "售后服务良好，能及时解决问题",
    criteria: {
      score100: "100%",
      score80: "90%-99%",
      score60: "80%-89%",
      score0: "<80%"
    },
    maxScore: 8
  }
];

// 创建一个新的组件来使用 useSearchParams
function EvaluationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [form] = Form.useForm();
  const [scores, setScores] = useState<{[key: number]: number}>({});
  const [totalScore, setTotalScore] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const isViewMode = mode === 'view';

  // 计算总分
  const handleScoreChange = (id: number, value: string) => {
    if (isViewMode) return;
    const newScores = { ...scores, [id]: Number(value) || 0 };
    setScores(newScores);
    const total = Object.values(newScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(total);
  };

  const columns: ColumnProps<EvaluationItem>[] = [
    {
      title: "序号",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "项目",
      dataIndex: "item",
      width: 120,
    },
    {
      title: "标准要求",
      dataIndex: "standard",
      width: 200,
    },
    {
      title: "考核指标",
      children: [
        {
          title: "满分分值*100%",
          dataIndex: "criteria.score100" as any,
          width: 120,
        },
        {
          title: "满分分值*80%",
          dataIndex: "criteria.score80" as any,
          width: 120,
        },
        {
          title: "满分分值*60%",
          dataIndex: "criteria.score60" as any,
          width: 120,
        },
        {
          title: "满分分值*0",
          dataIndex: "criteria.score0" as any,
          width: 120,
        }
      ]
    },
    {
      title: "标准",
      dataIndex: "maxScore",
      width: 80,
    },
    {
      title: "评分",
      dataIndex: "score",
      width: 100,
      render: (_: any, record: EvaluationItem) => {
        if (record.item === "总计") {
          return <span style={{ fontWeight: 'bold' }}>{totalScore}</span>;
        }
        
        if (isViewMode) {
          return <span>{scores[record.id] || 0}</span>;
        }

        return (
          <Input 
            type="number" 
            style={{ width: 80 }} 
            max={record.maxScore}
            onChange={(value) => handleScoreChange(record.id, value)} 
          />
        );
      }
    }
  ];

  // 表格数据加上总计行
  const tableData = [...evaluationItems, {
    id: evaluationItems.length + 1,
    item: "总计",
    standard: "",
    criteria: {
      score100: "",
      score80: "",
      score60: "",
      score0: ""
    },
    maxScore: 100,
    score: totalScore
  }];

  useEffect(() => {
    // 设置初始值
    form.setFieldsValue({
      supplierName: "上海科技有限公司",
      date: dayjs(),
      evaluationDepartment: "散杂货物流部",
      // 查看模式下设置模拟数据
      ...(isViewMode ? {
        evaluationPeriod: "2024年度",
        serviceScope: "物流服务",
        supplierInfo: "供应商基本情况描述",
        supplierPerformance: "供应商表现详细描述",
        conclusion: 1
      } : {})
    });

    // 查看模式下设置模拟评分数据
    if (isViewMode) {
      const mockScores = {
        1: 12,
        2: 12,
        3: 8,
        4: 6,
        5: 6,
        6: 6,
        7: 6,
        8: 8,
        9: 6,
        10: 6,
        11: 7
      };
      setScores(mockScores);
      const total = Object.values(mockScores).reduce((sum, score) => sum + score, 0);
      setTotalScore(total);
    }
  }, [form, isViewMode]);

  const handleSubmit = () => {
    setConfirmVisible(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmVisible(false);
    router.push('/evaluation');
  };

  const handleCancel = () => {
    if (isViewMode) {
      router.push('/evaluation');
      return;
    }

    Modal.confirm({
      title: '确认取消',
      content: '取消后填写的内容将不会保存，确认取消吗？',
      onOk: () => {
        router.push('/evaluation');
      }
    });
  };

  return (
    <div>
      <Title heading={2} style={{ marginBottom: 32 }}>
        供应商年度评审表
        {isViewMode && <span style={{ fontSize: '16px', marginLeft: '12px', color: 'var(--color-text-3)' }}>(查看模式)</span>}
      </Title>

      <Form form={form} layout="vertical" style={{ maxWidth: 1200 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr', 
          gap: '24px',
          marginBottom: '24px'
        }}>
          <FormItem label="供应商名称" field="supplierName">
            <Input placeholder="请输入供应商名称" disabled />
          </FormItem>
          <FormItem label="日期" field="date">
            <DatePicker style={{ width: '100%' }} disabled />
          </FormItem>
          <FormItem label="评价部门" field="evaluationDepartment">
            <Input disabled />
          </FormItem>
        </div>

        <Table
          columns={columns}
          data={tableData}
          border={{ wrapper: true, cell: true }}
          scroll={{ x: true }}
          pagination={false}
          style={{ marginBottom: '24px' }}
        />

        <Card style={{ marginBottom: '24px' }}>
          <FormItem label="评价年度" field="evaluationPeriod">
            <Input.TextArea placeholder="请输入评价年度" disabled={isViewMode} />
          </FormItem>
          
          <FormItem label="服务范围或产品" field="serviceScope">
            <Input.TextArea placeholder="请输入服务范围或产品" disabled={isViewMode} />
          </FormItem>

          <FormItem label="供应商基本情况" field="supplierInfo">
            <Input.TextArea placeholder="请输入供应商基本情况" disabled={isViewMode} />
          </FormItem>

          <FormItem label="详细描述供应商表现（评价期内）" field="supplierPerformance">
            <Input.TextArea placeholder="请输入供应商表现详细描述" disabled={isViewMode} />
          </FormItem>

          <FormItem label="结论" field="conclusion">
            <div>
              是否继续保持为合格供方：
              <Radio.Group disabled={isViewMode}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </div>
          </FormItem>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <Button type="secondary" size="large" onClick={handleCancel}>
            {isViewMode ? '返回' : '取消'}
          </Button>
          {!isViewMode && (
            <Button type="primary" size="large" onClick={handleSubmit}>
              提交评估
            </Button>
          )}
        </div>
      </Form>

      <Modal
        visible={confirmVisible}
        title={
          <span style={{ 
            fontWeight: 500,
            fontSize: '16px',
            color: 'var(--color-text-1)'
          }}>
            提交确认
          </span>
        }
        onOk={handleConfirmSubmit}
        onCancel={() => setConfirmVisible(false)}
        okText="确认提交"
        cancelText="返回修改"
        autoFocus={false}
        maskClosable={false}
      >
        <div style={{ 
          fontSize: '14px',
          color: 'var(--color-text-2)',
          marginBottom: '8px'
        }}>
          提交评估后无法自行修改，确认提交？
        </div>
      </Modal>
    </div>
  );
}

// 主页面组件
export default function BulkEvaluationFormPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size={40} />
      </div>
    }>
      <EvaluationForm />
    </Suspense>
  );
} 