import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Upload, Row, Col, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TinyEditor from '../../helpers/TinyEditor';
import { getAdminEditTour } from '../../services/adminTourServices';
import dayjs from 'dayjs';

const { Option } = Select;

function EditTourModal(props) {
  const { visible, onCancel, onOk, form, tourId } = props;

  const [categories, setCategories] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (visible && tourId) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const res = await getAdminEditTour(tourId);
          if (res && res.data) {
            setCategories(res.data.categories || []);
            const tourModeData = res.data.tour;

            // Chuyển mảng string url sang cấu trúc của Antd Upload
            let fList = [];
            if (tourModeData.images && tourModeData.images.length > 0) {
              fList = tourModeData.images.map((url, idx) => ({
                uid: `-url-${idx}`,
                name: `image-${idx}.png`,
                status: 'done',
                url: url
              }));
            }

            form.setFieldsValue({
              title: tourModeData.title,
              category_ids: tourModeData.category_ids || [],
              price: tourModeData.price,
              discount: tourModeData.discount,
              stock: tourModeData.stock,
              status: tourModeData.status,
              timeTour: tourModeData.timeTour,
              timeStart: tourModeData.timeStart ? dayjs(tourModeData.timeStart) : null,
              startDeparture: tourModeData.startDeparture,
              endDeparture: tourModeData.endDeparture,
              information: tourModeData.information,
              schedule: tourModeData.schedule,
              images: fList,
              position: tourModeData.position,
              code: tourModeData.code
            });
          }
        } catch (error) {
          console.error("Lỗi khi fetch data edit:", error);
        } finally {
          setLoadingData(false);
        }
      };

      fetchData();
    } else {
      form.resetFields();
    }
  }, [visible, tourId, form]);

  return (
    <Modal
      title={<span className="text-lg font-bold text-gray-800">Cập Nhật</span>}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={1200}
      style={{ top: 20 }}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{ className: "bg-blue-600 hover:!bg-blue-500 border-none text-white", disabled: loadingData }}
      cancelButtonProps={{ className: "bg-red-500 hover:!bg-red-400 border-none text-white", disabled: loadingData }}
      destroyOnClose
    >
      <Spin spinning={loadingData} tip="Đang nạp dữ liệu...">
        <Form
          form={form}
          layout="vertical"
          name="edit_tour_form"
          className="mt-4"
        >
          <Form.Item name="position" hidden><Input /></Form.Item>
          <Form.Item name="code" hidden><Input /></Form.Item>

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
                <Select mode="multiple" placeholder="Có thể chọn nhiều danh mục" className="rounded" loading={categories.length === 0 && loadingData}>
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
                <InputNumber className="w-full rounded" min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="discount" label={<span className="font-medium">Giảm giá (%)</span>}>
                <InputNumber className="w-full rounded" min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="stock" label={<span className="font-medium">Số chỗ</span>} rules={[{ required: true, message: 'Vui lòng nhập số chỗ!' }]}>
                <InputNumber className="w-full rounded" min={0} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label={<span className="font-medium">Trạng thái</span>}>
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
                <DatePicker className="w-full rounded" format="YYYY-MM-DD" placeholder="Chọn ngày" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="startDeparture" label={<span className="font-medium">Điểm khởi hành</span>} rules={[{ required: true, message: 'Vui lòng nhập nơi khởi hành!' }]}>
                <Input className="rounded" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="endDeparture" label={<span className="font-medium">Điểm đến</span>} rules={[{ required: true, message: 'Vui lòng nhập nơi kết thúc!' }]}>
                <Input className="rounded" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="information" label={<span className="font-medium">Mô tả tổng quan</span>}>
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
            <Upload listType="picture-card" maxCount={10} multiple beforeUpload={() => false}>
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

export default EditTourModal;
