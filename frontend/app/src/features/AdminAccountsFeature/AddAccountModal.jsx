import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAdminAccountCreate } from '../../services/adminAccountServices';

const { Option } = Select;

function AddAccountModal(props) {
  const { visible, onCancel, onOk, form } = props;
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminAccountCreate();
        if (res && res.data) {
          setRoles(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
    };
    if (visible) {
      fetchData();
      form.resetFields();
    }
  }, [visible, form]);



  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Thêm Mới Tài Khoản</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={700}
      style={{ top: 20 }}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white" }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white" }}
      centered
      forceRender
    >
      <Form form={form} layout="vertical" name="add_account_form" className="mt-4" initialValues={{ status: 'active' }}>
        <Row gutter={24}>
          <Col span={16}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="fullName"
                  label={<span className="font-medium">Họ tên</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                  <Input placeholder="Nhập họ tên" className="rounded" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<span className="font-medium">Email</span>}
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ email" className="rounded" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label={<span className="font-medium">Mật khẩu</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" className="rounded" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={<span className="font-medium">Số điện thoại</span>}
                >
                  <Input placeholder="Nhập số điện thoại" className="rounded" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="role_id"
                  label={<span className="font-medium">Phân quyền</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn phân quyền!' }]}
                >
                  <Select placeholder="Chọn phân quyền" className="rounded">
                    {roles.map(role => (
                      <Option key={role._id} value={role._id}>{role.title}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label={<span className="font-medium">Trạng thái</span>}
                >
                  <Select className="rounded">
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Dừng hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={8}>
            <Form.Item
              name="avatar"
              label={<span className="font-medium">Ảnh đại diện</span>}
              valuePropName="fileList"
              getValueFromEvent={(e) => { if (Array.isArray(e)) return e; return e?.fileList; }}
              className="flex flex-col items-center justify-center w-full"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
                className="w-full h-full object-cover"
              >
                <div className="flex flex-col items-center text-gray-500">
                  <PlusOutlined className="text-2xl" />
                  <div className="mt-2 text-sm font-medium">Tải ảnh lên</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Modal>
  );
}

export default AddAccountModal;
