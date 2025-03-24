"use client";

import { Typography } from "@arco-design/web-react";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="max-w-4xl">
      <Title heading={2} style={{ marginBottom: '24px', color: 'rgb(var(--red-6))', fontWeight: 'bold' }}>
        供应商评估系统 - 文档说明
      </Title>

      <div className="text-lg space-y-6">
        <Paragraph style={{ color: 'rgb(var(--red-6))', fontWeight: 'bold', marginBottom: '24px' }}>
          注意，此为售前概要方案，非最终实现效果的承诺，细节确认之后再定详细方案。
        </Paragraph>

        <Paragraph>
          以下页面都还是在 Cargoware 体系内进行修改，单独画出来只是为了方便展示。
        </Paragraph>

        <div>
          <Title heading={3} style={{ marginBottom: '16px' }}>核心功能点：</Title>
          <div className="space-y-4">
            <Paragraph>
              <strong>3.1 基础资料--合作伙伴--详情</strong>
              <div className="ml-5">
                模块，当勾选为"供应商"属性的时候，添加"需要完成年度评估"的选项
              </div>
            </Paragraph>

            <Paragraph>
              <strong>3.2 评估提醒机制</strong>
              <div className="ml-5">
                可以设置强提醒，在到期前提醒需要做评估的人完成年度评估任务
              </div>
            </Paragraph>

            <Paragraph>
              <strong>3.3 供应商评估页面</strong>
              <div className="ml-5">
                数据来自于所有勾选了供应商属性，需要被评估的企业，列表可以根据状态进行进行筛选
              </div>
            </Paragraph>

            <Paragraph>
              <strong>3.4 多评估表格支持</strong>
              <div className="ml-5">
                完成多个评估表格的选择，根据当前用户所属的权限（部门），来决定使用哪个表格
              </div>
            </Paragraph>

            <Paragraph>
              <strong>3.5 供应商冻结机制</strong>
              <div className="ml-5">
                合作伙伴要添加冻结机制，逾期未评估的供应商将无法被选中，完成评估之后可解冻
              </div>
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
}
