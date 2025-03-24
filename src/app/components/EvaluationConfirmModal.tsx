import { Modal, Select, Button, Space, Typography } from "@arco-design/web-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconInfoCircle } from "@arco-design/web-react/icon";

const { Text } = Typography;

interface EvaluationConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  supplierName: string;
}

export function EvaluationConfirmModal({ visible, onClose, supplierName }: EvaluationConfirmModalProps) {
  const router = useRouter();
  const [showSelect, setShowSelect] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const handleConfirm = async () => {
    try {
      // 默认跳转到集装箱物流部表单
      await router.push('/evaluation/form/container');
      onClose();
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  const handleChangeDepartment = () => {
    setShowSelect(true);
  };

  const handleSelectChange = async (value: string) => {
    setSelectedDepartment(value);
    try {
      // 根据选择的部门跳转到对应的表单页面
      let path = '';
      switch (value) {
        case 'container':
          path = '/evaluation/form/container';
          break;
        case 'bulk':
          path = '/evaluation/form/bulk';
          break;
        case 'other':
          path = '/evaluation/form/other';
          break;
        default:
          return;
      }
      await router.push(path);
      onClose();
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '18px',
          fontWeight: 500
        }}>
          <IconInfoCircle style={{ fontSize: '20px', color: 'rgb(var(--primary-6))' }} />
          评估表单确认
        </div>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ width: 500 }}
      maskClosable={false}
      closable={true}
    >
      <div style={{ 
        padding: '24px 0',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '24px'
      }}>
        <div style={{ 
          fontSize: '16px',
          color: 'var(--color-text-1)',
          lineHeight: '1.6',
          marginBottom: '8px'
        }}>
          根据您当前所属部门，为您匹配以下供应商评估表：
        </div>
        <div style={{ 
          fontSize: '16px',
          color: 'rgb(var(--primary-6))',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <IconInfoCircle style={{ fontSize: '16px' }} />
          【项目物流部】
        </div>
      </div>
      
      {!showSelect ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button 
            onClick={handleChangeDepartment}
            style={{ 
              padding: '0 24px',
              height: '36px',
              fontSize: '14px'
            }}
          >
            更换评估表
          </Button>
          <Button 
            type="primary" 
            onClick={handleConfirm}
            style={{ 
              padding: '0 24px',
              height: '36px',
              fontSize: '14px'
            }}
          >
            确认，去评估
          </Button>
        </div>
      ) : (
        <div>
          <div style={{ 
            fontSize: '16px',
            color: 'var(--color-text-1)',
            marginBottom: '16px'
          }}>
            请选择评估表：
          </div>
          <Select
            placeholder="请选择部门"
            style={{ width: '100%' }}
            onChange={handleSelectChange}
            options={[
              { label: '集装箱物流部', value: 'container' },
              { label: '散杂货物流部', value: 'bulk' },
              { label: '其他', value: 'other' },
            ]}
            size="large"
          />
        </div>
      )}
    </Modal>
  );
} 