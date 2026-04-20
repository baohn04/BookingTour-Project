import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, message } from 'antd';
import { getAdminRoleEdit } from '../../services/adminRoleServices';

function EditRoleModal(props) {
  const { visible, onCancel, onOk, form, roleId } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && roleId) {
      const fetchDetail = async () => {
        setLoading(true);
        try {
          const res = await getAdminRoleEdit(roleId);
          if (res && res.data) {
            form.setFieldsValue({
              title: res.data.title,
              description: res.data.description,
            });
          }
        } catch (error) {
          console.error(error);
          message.error("Không thể tải thông tin nhóm quyền!");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      form.resetFields();
    }
  }, [visible, roleId, form]);

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Chỉnh Sửa Nhóm Quyền</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      style={{ top: 50 }}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white", disabled: loading }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white" }}
      centered
      forceRender
    >
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Form form={form} layout="vertical" name="edit_role_form" className="mt-4">
          <Form.Item
            name="title"
            label={<span className="font-medium">Tên nhóm quyền</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên nhóm quyền!' }]}
          >
            <Input placeholder="Nhập tên nhóm quyền" className="rounded" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-medium">Mô tả</span>}
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả..." className="rounded" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default EditRoleModal;
