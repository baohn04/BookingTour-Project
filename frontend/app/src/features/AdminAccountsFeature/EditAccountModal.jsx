import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Spin, Upload, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAdminAccountEdit } from '../../services/adminAccountServices';

const { Option } = Select;

function EditAccountModal({ visible, onCancel, onOk, form, accountId }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && accountId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await getAdminAccountEdit(accountId);
          if (res) {
            if (res.roles) {
              setRoles(res.roles);
            }
            if (res.data) {
              const accountInfo = res.data
              form.setFieldsValue({
                fullName: accountInfo.fullName,
                email: accountInfo.email,
                phone: accountInfo.phone,
                role_id: accountInfo.role_id,
                status: accountInfo.status,
                avatar: accountInfo.avatar ? [{ uid: '-1', name: 'current_avatar.png', status: 'done', url: accountInfo.avatar }] : [],
              });
            }
          }
        } catch (err) {
          console.error("Failed to fetch account info", err);
          message.error("Không thể tải thông tin tài khoản!");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      form.resetFields();
    }
  }, [visible, accountId, form]);



  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Cập Nhật Tài Khoản</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={700}
      style={{ top: 20 }}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white", disabled: loading }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white" }}
      centered
      forceRender
    >
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Form form={form} layout="vertical" name="edit_account_form" className="mt-4">
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
                    <Input placeholder="Nhập địa chỉ email" disabled className="rounded" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label={<span className="font-medium">Mật khẩu</span>}
                  >
                    <Input.Password placeholder="Nhập mật khẩu mới" className="rounded" />
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
                    <div className="mt-2 text-sm font-medium">Thay đổi ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Spin>
    </Modal>
  );
}

export default EditAccountModal;
