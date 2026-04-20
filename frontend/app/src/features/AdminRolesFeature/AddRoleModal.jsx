import React from 'react';
import { Modal, Form, Input } from 'antd';

function AddRoleModal(props) {
  const { visible, onCancel, onOk, form } = props;

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Thêm Mới Nhóm Quyền</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      style={{ top: 50 }}
      okText="Lưu nhóm quyền"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white" }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white" }}
      centered
      forceRender
    >
      <Form form={form} layout="vertical" name="add_role_form" className="mt-4">
        <Form.Item
          name="title"
          label={<span className="font-medium">Tên nhóm quyền</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên nhóm quyền!' }]}
        >
          <Input placeholder="Ví dụ: Quản trị viên, Biên tập viên..." className="rounded" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<span className="font-medium">Mô tả ngắn gọn</span>}
        >
          <Input.TextArea rows={4} placeholder="Nhập mô tả về phạm vi của nhóm quyền này..." className="rounded" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddRoleModal;
