import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAdminEditCategory } from '../../services/adminCategoryServices';

const { Option } = Select;

function EditCategoryModal(props) {
  const { visible, onCancel, onOk, form, categoryId } = props;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && categoryId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await getAdminEditCategory(categoryId);
          if (res && res.data) {
            const cat = res.data;

            // Chuyển ảnh URL sang cấu trúc fileList của Antd Upload
            let fList = [];
            if (cat.image) {
              fList = [{
                uid: '-existing-0',
                name: 'current-image.png',
                status: 'done',
                url: cat.image
              }];
            }

            form.setFieldsValue({
              title: cat.title,
              description: cat.description,
              status: cat.status,
              position: cat.position,
              image: fList
            });
          }
        } catch (error) {
          console.error("Lỗi khi fetch chi tiết danh mục:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      form.resetFields();
    }
  }, [visible, categoryId, form]);

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Cập Nhật Danh Mục</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={700}
      style={{ top: 20 }}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white", disabled: loading }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white" }}
      forceRender
    >
      <Spin spinning={loading} tip="Đang tải dữ liệu...">
        <Form form={form} layout="vertical" name="edit_category_form" className="mt-4">
          <Form.Item name="position" hidden><Input /></Form.Item>

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

          <Form.Item name="status" label={<span className="font-medium">Trạng thái</span>}>
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
      </Spin>
    </Modal>
  );
};

export default EditCategoryModal;
