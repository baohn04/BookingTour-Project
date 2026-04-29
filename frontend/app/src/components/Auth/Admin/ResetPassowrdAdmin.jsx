import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPasswordAdmin } from '../../../services/adminAuthServices';

const { Text } = Typography;

function ResetPasswordAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const email = location.state?.email;

  useEffect(() => {
    // Nếu người dùng truy cập trực tiếp URL này mà không có token, đẩy về trang Quên mật khẩu
    const token = localStorage.getItem('resetToken');
    if (!token) {
      message.error('Vui lòng thực hiện luồng Quên mật khẩu trước!');
      navigate('/admin/auth/forgot-password');
    }
  }, [navigate]);

  const onFinish = async (values) => {
    const token = localStorage.getItem('resetToken');
    if (!token) {
      message.error('Phiên làm việc đã hết hạn. Vui lòng thử lại!');
      navigate('/admin/auth/forgot-password');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordAdmin({
        password: values.password,
        confirmPassword: values.confirmPassword,
        token: token
      });

      if (res && res.message) {
        message.success(res.message);
        // Xóa token sau khi đổi mật khẩu thành công
        localStorage.removeItem('resetToken');
        navigate('/admin/auth/login');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-[480px] p-8 bg-white rounded-2xl shadow-sm">
        <div className="text-center mb-8">
          <Text className="text-gray-500 text-lg font-medium">
            Thiết lập mật khẩu mới
          </Text>
          {email && (
            <div className="mt-2 text-sm text-gray-400">
              Tài khoản: <span className="font-semibold text-gray-600">{email}</span>
            </div>
          )}
        </div>

        <Form
          name="admin_reset_password"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-600 font-medium">Mật khẩu mới</span>}
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu mới"
              className="rounded-lg bg-gray-50 border-none h-12 hover:bg-gray-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-600 font-medium">Xác nhận mật khẩu</span>}
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập lại mật khẩu mới"
              className="rounded-lg bg-gray-50 border-none h-12 hover:bg-gray-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <Form.Item className="pt-4 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="h-12 rounded-lg font-semibold text-lg bg-primary hover:bg-primary-hover border-none"
              style={{ backgroundColor: 'blue' }}
            >
              Thay đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ResetPasswordAdmin;
