"use client";

import { useState } from "react";
import {
  Form,
  Checkbox,
  Select,
  InputNumber,
  Button,
  Space,
  Typography,
  Input,
  Modal,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";

const FormItem = Form.Item;
const { Title } = Typography;

const formStyles = {
  label: {
    fontSize: '16px',
    fontWeight: 500,
    display: 'block',
    marginBottom: '8px'
  },
  content: {
    fontSize: '16px'
  }
};

// 模拟的用户数据
const userOptions = [
  { id: 1, name: '张三', department: '采购部', email: 'zhangsan@company.com' },
  { id: 2, name: '李四', department: '质量管理部', email: 'lisi@company.com' },
  { id: 3, name: '王五', department: '供应链管理部', email: 'wangwu@company.com' },
  { id: 4, name: '赵六', department: '财务部', email: 'zhaoliu@company.com' },
  { id: 5, name: '钱七', department: '采购部', email: 'qianqi@company.com' },
];

interface Evaluator {
  id: number;
  label: string;
  checked: boolean;
  email?: string;
  notifyMethods: {
    popup: boolean;
    email: boolean;
  };
}

export default function SupplierPage() {
  const [isCustomer, setIsCustomer] = useState(true);
  const [isSupplier, setIsSupplier] = useState(true);
  const [needAssessment, setNeedAssessment] = useState(true);
  const [evaluators, setEvaluators] = useState<Evaluator[]>([
    {
      id: 1,
      label: "创建人",
      checked: true,
      email: "default@company.com",
      notifyMethods: { popup: true, email: false }
    },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNotifyMethodChange = (evaluatorId: number, method: 'popup' | 'email', checked: boolean) => {
    setEvaluators(evaluators.map(e => {
      if (e.id === evaluatorId) {
        return {
          ...e,
          notifyMethods: {
            ...e.notifyMethods,
            [method]: checked
          }
        };
      }
      return e;
    }));
  };

  const handleEmailChange = (evaluatorId: number, email: string) => {
    setEvaluators(evaluators.map(e => {
      if (e.id === evaluatorId) {
        return {
          ...e,
          email
        };
      }
      return e;
    }));
  };

  const handleAddEvaluator = () => {
    setIsModalVisible(true);
  };

  const handleSelectUser = (userId: number) => {
    const selectedUser = userOptions.find(u => u.id === userId);
    if (selectedUser) {
      const newId = evaluators.length + 1;
      setEvaluators([
        ...evaluators,
        {
          id: newId,
          label: selectedUser.name,
          checked: true,
          email: selectedUser.email,
          notifyMethods: { popup: true, email: false }
        },
      ]);
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <Title heading={2} style={{ color: "rgb(var(--red-6))", marginBottom: 32, fontSize: '24px' }}>
        【此处为基本资料--供应商详情 页面】
      </Title>

      <Form layout="vertical" style={{ maxWidth: 800 }}>
        <div className="mb-6">
          <div style={formStyles.label}>合作伙伴类型</div>
          <Space size="large" style={formStyles.content}>
            <Checkbox checked={isCustomer} onChange={setIsCustomer} style={{ fontSize: '16px' }}>
              客户
            </Checkbox>
            <Checkbox checked={isSupplier} onChange={setIsSupplier} style={{ fontSize: '16px' }}>
              供应商
            </Checkbox>
          </Space>
        </div>

        {isSupplier && (
          <>
            <div className="mb-6">
              <div style={formStyles.label}>是否提醒年度评估</div>
              <Checkbox checked={needAssessment} onChange={setNeedAssessment} style={{ fontSize: '16px' }}>
                是
              </Checkbox>
            </div>

            {needAssessment && (
              <>
                <div className="mb-6">
                  <div style={formStyles.label}>评估截止时间</div>
                  <Select 
                    defaultValue="oneYear" 
                    style={{ width: 240 }}
                    size="large"
                  >
                    <Select.Option value="oneYear">创建后1年</Select.Option>
                    <Select.Option value="endOfYear">自然年阳历年底</Select.Option>
                  </Select>
                </div>

                <div className="mb-6">
                  <div style={formStyles.label}>提醒时间</div>
                  <Space style={formStyles.content}>
                    <span>截止时间前</span>
                    <InputNumber
                      style={{ width: 120 }}
                      defaultValue={30}
                      min={1}
                      precision={0}
                      size="large"
                    />
                    <span>天</span>
                  </Space>
                </div>

                <div className="mb-6">
                  <div style={formStyles.label}>评估人</div>
                  <Space direction="vertical" style={{ width: "100%" }} size="large">
                    {evaluators.map((evaluator) => (
                      <div key={evaluator.id} className="border-b pb-4">
                        <Space direction="vertical" size="medium" style={{ width: "100%" }}>
                          <Checkbox
                            checked={evaluator.checked}
                            onChange={(checked) => {
                              setEvaluators(
                                evaluators.map((e) =>
                                  e.id === evaluator.id
                                    ? { ...e, checked }
                                    : e
                                )
                              );
                            }}
                            style={{ fontSize: '16px' }}
                          >
                            {evaluator.label}
                          </Checkbox>
                          <div className="ml-6">
                            <Space direction="vertical" size="medium" style={{ width: "100%" }}>
                              <div>
                                <Space size="large">
                                  <span style={{ fontSize: '16px' }}>提醒方式：</span>
                                  <Checkbox
                                    checked={evaluator.notifyMethods.popup}
                                    onChange={(checked) => handleNotifyMethodChange(evaluator.id, 'popup', checked)}
                                    style={{ fontSize: '16px' }}
                                  >
                                    弹窗
                                  </Checkbox>
                                  <Checkbox
                                    checked={evaluator.notifyMethods.email}
                                    onChange={(checked) => handleNotifyMethodChange(evaluator.id, 'email', checked)}
                                    style={{ fontSize: '16px' }}
                                  >
                                    邮箱
                                  </Checkbox>
                                </Space>
                              </div>
                              {evaluator.notifyMethods.email && (
                                <Input
                                  value={evaluator.email}
                                  onChange={(value) => handleEmailChange(evaluator.id, value)}
                                  placeholder="请输入邮箱地址"
                                  style={{ width: 300 }}
                                  size="large"
                                />
                              )}
                            </Space>
                          </div>
                        </Space>
                      </div>
                    ))}
                    <Button
                      type="primary"
                      icon={<IconPlus />}
                      onClick={handleAddEvaluator}
                      size="large"
                      style={{ fontSize: '16px', height: 'auto', padding: '8px 16px' }}
                    >
                      增加提醒人
                    </Button>
                  </Space>
                </div>
              </>
            )}
          </>
        )}
      </Form>

      <Modal
        title={<span style={{ fontSize: '18px' }}>选择提醒人</span>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        style={{ width: 600 }}
      >
        <Select
          placeholder="请选择提醒人"
          style={{ width: '100%' }}
          size="large"
          onChange={handleSelectUser}
        >
          {userOptions.map(user => (
            <Select.Option key={user.id} value={user.id}>
              <Space style={{ fontSize: '16px' }}>
                <span style={{ width: 80 }}>{user.name}</span>
                <span style={{ width: 120 }}>{user.department}</span>
                <span>{user.email}</span>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
} 