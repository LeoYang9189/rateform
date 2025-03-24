"use client";

import { Typography } from "@arco-design/web-react";

const { Title, Text } = Typography;

export default function OtherEvaluationFormPage() {
  return (
    <div>
      <Title heading={2} style={{ marginBottom: 32 }}>
        其他评估表单
      </Title>
      <Text style={{ fontSize: '16px', color: 'var(--color-text-2)' }}>
        用户可能会添加更多的额外表格
      </Text>
    </div>
  );
} 