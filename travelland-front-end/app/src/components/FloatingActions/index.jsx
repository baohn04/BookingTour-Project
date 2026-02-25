import React from 'react';
import { FloatButton } from 'antd';
import { MessageOutlined, ShoppingCartOutlined } from '@ant-design/icons';

function FloatingActions() {
  return (
    <FloatButton.Group
      shape="circle"
      className="!right-6 !bottom-6 md:!right-10 md:!bottom-10 !z-[100]"
    >
      {/* Shopping Cart Button */}
      <FloatButton
        icon={<ShoppingCartOutlined className="!text-lg" />}
        type="primary"
        className="!bg-primary hover:!bg-primary-hover !w-12 !h-12 md:!w-14 md:!h-14 shadow-lg shadow-primary/30 mb-3"
        badge={{ count: 2, overflowCount: 99, color: 'red' }}
        tooltip={<span className="font-medium">Giỏ hàng rỗng</span>}
      />

      {/* Chat / Support Button */}
      <FloatButton
        icon={<MessageOutlined className="!text-lg" />}
        type="primary"
        className="!bg-primary hover:!bg-primary-hover !w-12 !h-12 md:!w-14 md:!h-14 shadow-lg shadow-primary/30 mb-3"
        tooltip={<span className="font-medium">Hỗ trợ 24/7</span>}
      />

      {/* Back to Top */}
      <FloatButton.BackTop
        type="primary"
        className="!bg-primary hover:!bg-primary-hover !w-12 !h-12 md:!w-14 md:!h-14 shadow-lg shadow-text1/20"
        visibilityHeight={300}
        duration={500}
        tooltip={<span className="font-medium">Lên đầu trang</span>}
      />
    </FloatButton.Group>
  );
}

export default FloatingActions;
