import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordAdmin, verifyOtpAdmin } from '../../../services/adminAuthServices';

const { Text } = Typography;

function ForgotPasswordAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(0); 

  useEffect(() => {
    let timer;
    if (isModalOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isModalOpen, timeLeft]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await forgotPasswordAdmin({ email: values.email });
      if (res && res.message) {
        message.success(res.message);
        setEmail(values.email);
        const expireInSeconds = res.timeExpire ? res.timeExpire * 60 : 180;
        setTimeLeft(expireInSeconds);
        setIsModalOpen(true);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values) => {
    setOtpLoading(true);
    try {
      const res = await verifyOtpAdmin({ email: email, otp: values.otp });
      if (res && res.message) {
        message.success(res.message);
        setIsModalOpen(false);
        // Lưu token vào localStorage hoặc truyền qua state để reset password dùng
        if (res.token) {
          localStorage.setItem('resetToken', res.token);
        }
        navigate('/admin/auth/reset-password', { state: { email } });
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Mã OTP không chính xác!');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await forgotPasswordAdmin({ email: email });
      if (res && res.message) {
        message.success("Đã gửi lại mã OTP mới!");
        const expireInSeconds = res.timeExpire ? res.timeExpire * 60 : 180;
        setTimeLeft(expireInSeconds); // Reset timer dựa trên server
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-[480px] p-8 bg-white rounded-2xl shadow-sm">
        <div className="text-center mb-8">
          <Text className="text-gray-500 text-lg font-medium">
            Khôi phục mật khẩu quản trị viên
          </Text>
        </div>

        <Form
          name="admin_forgot_password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-600 font-medium">Email</span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập email của bạn"
              className="rounded-lg bg-gray-50 border-none h-12 hover:bg-gray-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <Link to="/admin/auth/login">
            <div className="flex justify-end">
              <button type="button" className="text-gray-400 hover:text-primary transition-colors text-sm">
                Quay lại đăng nhập
              </button>
            </div>
          </Link>

          <Form.Item className="pt-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="h-12 rounded-lg font-semibold text-lg bg-primary hover:bg-primary-hover border-none"
              style={{ backgroundColor: 'blue' }}
            >
              Gửi yêu cầu
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Modal nhập OTP */}
      <Modal
        title={<span className="text-lg font-bold text-gray-800">Nhập mã xác thực OTP</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="text-center mb-6 mt-4">
          <Text className="text-gray-500">
            Vui lòng nhập mã OTP gồm 6 chữ số vừa được gửi đến email của bạn.
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleOtpSubmit} className="flex flex-col items-center">
          <Form.Item
            name="otp"
            rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
          >
            <Input.OTP length={6} size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={otpLoading}
            className="w-full h-12 rounded-lg font-semibold bg-blue-500 hover:bg-blue-700 border-none mt-2"
          >
            Xác nhận
          </Button>

          <div className="mt-4 text-sm text-center">
            {timeLeft > 0 ? (
              <Text className="text-gray-500">
                Mã sẽ hết hạn sau: <span className="font-bold text-blue-500">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </Text>
            ) : (
              <div className="flex flex-col items-center">
                <Text className="text-red-500 mb-2">Mã OTP đã hết hạn!</Text>
                <Button type="link" onClick={handleResendOtp} className="p-0 text-blue-500 hover:text-blue-700 font-medium">
                  Gửi lại mã OTP mới
                </Button>
              </div>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default ForgotPasswordAdmin;