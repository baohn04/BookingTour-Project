import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../services/adminAuthServices';
import { setCookie } from '../../../utils/cookie';

const { Text } = Typography;
function LoginAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await loginAdmin(values);
      if (result.code === 200) {
        setCookie('accessToken', result.accessToken, 1);
        setCookie('refreshToken', result.refreshToken, 7);
        message.success(result.message);
        navigate('/admin');
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-[480px] p-8 bg-white rounded-2xl shadow-sm">
        <div className="text-center mb-8">
          <Text className="text-gray-500 text-lg font-medium">
            Đăng nhập tài khoản quản trị viên
          </Text>
        </div>

        <Form
          name="admin_login"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label={<span className="text-gray-600 font-medium">Email</span>}
            placeholder="Nhập email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập email"
              className="rounded-lg bg-gray-50 border-none h-12 hover:bg-gray-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-600 font-medium">Mật khẩu</span>}
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              size="large"
              placeholder="Nhập mật khẩu"
              className="rounded-lg bg-gray-50 border-none h-12 hover:bg-gray-100 focus:bg-white transition-all"
            />
          </Form.Item>

          <div className="flex justify-end -mt-2">
            <button type="button" className="text-gray-400 hover:text-primary transition-colors text-sm">
              Quên mật khẩu?
            </button>
          </div>

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

              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginAdmin;
