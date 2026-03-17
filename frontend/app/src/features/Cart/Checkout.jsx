import React, { useState } from 'react';
import { Modal, Typography, Button, Divider } from 'antd';
import { WalletOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Text, Title } = Typography;

function Checkout(props) {
  const { isVisible, onClose, onConfirm, loading, cartDetails = [], total = 0 } = props;
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  const handleConfirm = () => {
    onConfirm(paymentMethod);
  };

  const paymentOptions = [
    {
      id: 'vnpay',
      name: 'Thanh toán qua VNPay',
      desc: 'Quét mã QR, Thẻ ATM, VISA, Mastercard.',
      logo: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg',
      bgType: 'bg-blue-50'
    },
    {
      id: 'momo',
      name: 'Thanh toán qua MoMo',
      desc: 'Nhanh chóng, tiện lợi bằng Ví MoMo.',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/MoMo_Logo_App.svg/1280px-MoMo_Logo_App.svg.png',
      bgType: 'bg-pink-50'
    },
    {
      id: 'cash',
      name: 'Thanh toán sau (Tiền mặt / Chuyển khoản)',
      desc: 'Nhân viên sẽ liên hệ để xác nhận.',
      icon: <WalletOutlined className="text-[24px] text-gray-500" />,
      bgType: 'bg-gray-100'
    }
  ];

  return (
    <Modal
      title={<Title level={4} className="!m-0 text-center text-text1">Thanh Toán Đặt Tour</Title>}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} size="large" className="rounded-lg font-medium border-gray-300">
          Hủy bỏ
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleConfirm}
          size="large"
          className="bg-primary hover:!bg-primary-hover rounded-lg font-bold px-8 text-white border-none"
        >
          Xác nhận thanh toán
        </Button>,
      ]}
      centered
      width={520}
      className="font-sans"
    >
      <div className="py-2">
        {/* Tóm tắt đơn hàng */}
        <div className="bg-orange-50/50 border border-primary/20 rounded-xl p-4 mb-5">
          <Text className="font-bold text-text1 text-[16px] mb-3 block">Tóm tắt đơn đặt tour:</Text>
          <div className="flex flex-col gap-2 mb-3">
            {cartDetails.map((item, index) => (
              <div key={item.id || index} className="flex justify-between items-start">
                <Text className="text-gray-600 text-[14px] flex-1 pr-4 line-clamp-2">
                  <span className="font-semibold text-text1">{item.quantity}x</span> {item.info?.title || 'Tour du lịch'}
                </Text>
                <Text className="font-medium text-text1 shrink-0">
                  {item.total?.toLocaleString()}đ
                </Text>
              </div>
            ))}
          </div>
          <Divider className="my-3 border-primary/20" />
          <div className="flex justify-between items-center">
            <Text className="font-bold text-[16px] text-text1">Tổng thanh toán:</Text>
            <Text className="font-extrabold text-[22px] text-primary">
              {total.toLocaleString()}đ
            </Text>
          </div>
        </div>

        <Text className="text-gray-600 font-semibold text-[15px] mb-3 block">
          Chọn phương thức thanh toán:
        </Text>

        <div className="flex flex-col gap-3">
          {paymentOptions.map((option) => {
            const isActive = paymentMethod === option.id;
            return (
              <div
                key={option.id}
                onClick={() => setPaymentMethod(option.id)}
                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-sm ${isActive ? 'border-primary bg-orange-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-primary/50'
                  }`}
              >
                {/* Icon / Logo Area */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${option.bgType}`}>
                  {option.logo ? (
                    <img src={option.logo} alt={option.name} className="w-10 h-10 object-contain" />
                  ) : (
                    option.icon
                  )}
                </div>

                {/* Text Info */}
                <div className="flex flex-col flex-1">
                  <Text className={`font-bold text-[16px] ${isActive ? 'text-primary' : 'text-text1'}`}>
                    {option.name}
                  </Text>
                  <Text className="text-gray-500 text-[13px] leading-tight mt-1">
                    {option.desc}
                  </Text>
                </div>

                {/* Checkmark Indicator */}
                <div className="w-6 h-6 flex items-center justify-center shrink-0 ml-2">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}>
                    {isActive && <CheckCircleFilled className="text-white text-[18px]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

export default Checkout;
