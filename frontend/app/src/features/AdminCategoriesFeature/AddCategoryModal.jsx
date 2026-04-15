import React from 'react';
import { Modal, Form, Input, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddCategoryModal = ({ visible, onCancel, onOk, form }) => {

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Thêm Mới Danh Mục</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={700}
      style={{ top: 20 }}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white" }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white" }}
    >
      <Form form={form} layout="vertical" name="add_category_form" className="mt-4">
        <Form.Item
          name="title"
          label={<span className="font-medium">Tên Danh Mục</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
        >
          <Input placeholder="Ví dụ: Tour Miền Bắc..." className="rounded" />
        </Form.Item>

        <Form.Item name="description" label={<span className="font-medium">Mô tả</span>}>
          <Input.TextArea rows={3} placeholder="Nhập mô tả danh mục..." className="rounded" />
        </Form.Item>

        <Form.Item
          name="status"
          label={<span className="font-medium">Trạng thái</span>}
          initialValue="active"
        >
          <Select className="rounded">
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Tạm dừng</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="image"
          label={<span className="font-medium">Hình ảnh đại diện</span>}
          valuePropName="fileList"
          getValueFromEvent={(e) => { if (Array.isArray(e)) return e; return e?.fileList; }}
        >
          <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
