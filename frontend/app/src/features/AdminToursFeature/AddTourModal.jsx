import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Upload, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TinyEditor from '../../helpers/TinyEditor';
import { getAdminCreateTour } from '../../services/adminTourServices';

const { Option } = Select;

function AddTourModal(props) {
  const { visible, onCancel, onOk, form } = props;

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  useEffect(() => {
    if (visible && categories.length === 0) {
      const fetchCategories = async () => {
        setLoadingCats(true);
        try {
          const res = await getAdminCreateTour();
          if (res && res.data && res.data.categories) {
            setCategories(res.data.categories);
          }
        } catch (error) {
          console.error("Lỗi khi fetch categories:", error);
        } finally {
          setLoadingCats(false);
        }
      };

      fetchCategories();
    }
  }, [visible, categories.length]);

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Thêm Mới</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={1200}
      style={{ top: 20 }}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 hover:!opacity-90 border-none text-white transition-colors" }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 hover:!opacity-90 border-none text-white transition-colors" }}
      forceRender
    >
      <Form
        form={form}
        layout="vertical"
        name="add_tour_form"
        className="mt-4"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="title" label={<span className="font-medium">Tên Tour</span>} rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}>
              <Input placeholder="Ví dụ: Hạ Long Bay Cruise..." className="rounded" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="category_ids" label={<span className="font-medium">Danh mục</span>}>
              <Select mode="multiple" placeholder="Có thể chọn nhiều danh mục" className="rounded" loading={loadingCats}>
                {categories.map(cat => (
                  <Option key={cat._id} value={cat._id}>{cat.title}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="price" label={<span className="font-medium">Giá (VNĐ)</span>} rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
              <InputNumber className="w-full rounded" min={0} placeholder="Ví dụ: 2500000" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="discount" label={<span className="font-medium">Giảm giá (%)</span>}>
              <InputNumber className="w-full rounded" min={0} max={100} placeholder="Ví dụ: 10" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="stock" label={<span className="font-medium">Số chỗ</span>} rules={[{ required: true, message: 'Vui lòng nhập số chỗ!' }]}>
              <InputNumber className="w-full rounded" min={0} placeholder="Ví dụ: 20" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label={<span className="font-medium">Trạng thái</span>} initialValue="active">
              <Select placeholder="Chọn trạng thái" className="rounded">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Tạm dừng</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="timeTour" label={<span className="font-medium">Thời gian</span>} rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
              <Input placeholder="Ví dụ: 2N1Đ" className="rounded" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="timeStart" label={<span className="font-medium">Ngày khởi hành</span>}>
              <DatePicker className="w-full rounded" format="DD/MM/YYYY" placeholder="Chọn ngày" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="startDeparture" label={<span className="font-medium">Điểm khởi hành</span>} rules={[{ required: true, message: 'Vui lòng nhập địa điểm khởi hành!' }]}>
              <Input placeholder="Ví dụ: Hà Nội" className="rounded" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="endDeparture" label={<span className="font-medium">Điểm đến</span>} rules={[{ required: true, message: 'Vui lòng nhập địa điểm kết thúc!' }]}>
              <Input placeholder="Ví dụ: Hạ Long" className="rounded" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="information" label={<span className="font-medium">Mô tả</span>}>
          <TinyEditor />
        </Form.Item>

        <Form.Item name="schedule" label={<span className="font-medium">Lịch trình</span>}>
          <TinyEditor />
        </Form.Item>

        <Form.Item
          name="images"
          label={<span className="font-medium">Thư viện Hình ảnh</span>}
          valuePropName="fileList"
          getValueFromEvent={(e) => { if (Array.isArray(e)) return e; return e?.fileList; }}
        >
          <Upload listType="picture-card" maxCount={5} multiple beforeUpload={() => false}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên (<i>Có thể chọn nhiều ảnh</i>)</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTourModal;
