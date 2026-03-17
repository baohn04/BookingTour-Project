import React, { useState } from 'react';
import { Form, Input, Row, Col, Typography, Button, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { postOrder } from '../../services/orderServices';
import { clearCart } from '../../actions/cart';
import Checkout from './Checkout';

const { Title } = Typography;

function InfoBooking(props) {
  const { cartDetails, total } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const cart = useSelector(state => state.cartReducer);
  const dispatch = useDispatch();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [formData, setFormData] = useState(null);

  const onFinish = (values) => {
    if (cart.length === 0) {
      message.warning('Giỏ hàng của bạn đang trống!');
      return;
    }
    setFormData(values);
    setIsCheckoutVisible(true);
  };

  const handleConfirmCheckout = async (paymentMethod) => {
    setLoading(true);
    try {
      const data = {
        info: formData,
        cart: cart,
        paymentMethod: paymentMethod,
        totalAmount: total
      };

      const res = await postOrder(data);
      if (res) {
        if (res.data && res.data.payUrl) {
          window.location.href = res.data.payUrl;
          return;
        }
        message.success("Đặt tour thành công! Cảm ơn bạn.");
        form.resetFields();
        dispatch(clearCart());
        setIsCheckoutVisible(false);
      } else {
        message.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Gửi thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 font-sans">
      <div className="flex items-center gap-3 mb-4">
        <Title level={4} className="!m-0 text-text1">Thông tin liên hệ</Title>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-gray-700">Họ và tên <span className="text-red-500">*</span></span>}
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input size="large" placeholder="Nhập họ tên người đặt" className="rounded-md" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span className="font-semibold text-gray-700">Số điện thoại liên hệ <span className="text-red-500">*</span></span>}
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input size="large" placeholder="Nhập số điện thoại liên hệ" className="rounded-md" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Ghi chú / Yêu cầu thêm</span>}
            name="note"
          >
            <Input.TextArea
              rows={7}
              placeholder="Vui lòng gửi yêu cầu cho chúng tôi bằng tiếng Việt hoặc tiếng Anh"
              className="rounded-md"
            />
          </Form.Item>

          <div className="flex justify-end mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="bg-primary hover:!bg-primary-hover font-bold px-10 h-12 rounded-lg text-white transition-colors"
            >
              Gửi yêu cầu
            </Button>
          </div>
        </Form>
      </div>

      <Checkout
        isVisible={isCheckoutVisible}
        onClose={() => setIsCheckoutVisible(false)}
        onConfirm={handleConfirmCheckout}
        loading={loading}
        cartDetails={cartDetails}
        total={total}
      />
    </div>
  );
}

export default InfoBooking;