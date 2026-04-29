import React, { useState } from 'react';
import { Table, Button, Input, Tag, Space, Tooltip, Form, Select, Row, Col, message, Popconfirm, Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AddTourModal from '../../../features/AdminToursFeature/AddTourModal';
import EditTourModal from '../../../features/AdminToursFeature/EditTourModal';
import DetailTourModal from '../../../features/AdminToursFeature/DetailTourModal';
import { useAdminTours } from '../../../hooks/useAdminTours';
import { changeTourStatus, createAdminTour, editAdminTour, deleteAdminTour } from '../../../services/adminTourServices';

function AdminTours() {
  const { tours, pagination, loading, refetchTours, queryParams, setQueryParams } = useAdminTours();
  const permissions = useSelector(state => state.account?.userInfo?.role?.permissions || []);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [editTourId, setEditTourId] = useState(null);
  const [detailTourId, setDetailTourId] = useState(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const showEditModal = (tourId) => {
    setIsEditModalVisible(true);
    setEditTourId(tourId);
  };

  const showDetailModal = (tourId) => {
    setIsDetailModalVisible(true);
    setDetailTourId(tourId);
  };

  const handleCreateOk = async () => {
    try {
      const values = await createForm.validateFields();

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("price", values.price || 0);
      formData.append("discount", values.discount || 0);
      formData.append("stock", values.stock || 0);
      formData.append("status", values.status || "active");

      // Handle Datetime
      if (values.timeTour) formData.append("timeTour", values.timeTour);
      if (values.timeStart) formData.append("timeStart", values.timeStart.format("YYYY-MM-DD"));

      // Handle Location & Schedule info
      if (values.startDeparture) formData.append("startDeparture", values.startDeparture);
      if (values.endDeparture) formData.append("endDeparture", values.endDeparture);
      formData.append("information", values.information || "");
      formData.append("schedule", values.schedule || "");

      // Handle Array of Categories
      if (values.category_ids && values.category_ids.length > 0) {
        values.category_ids.forEach(id => formData.append("category_ids", id));
      }

      // Handle raw files uploading
      if (values.images && values.images.length > 0) {
        values.images.forEach(fileObj => {
          if (fileObj.originFileObj) {
            formData.append("images", fileObj.originFileObj);
          }
        });
      }

      message.loading({ content: 'Đang lưu tour...', key: 'createTour' });
      const response = await createAdminTour(formData);

      if (response && response.data) {
        await refetchTours();
        message.success({ content: 'Tạo tour mới thành công!', key: 'createTour', duration: 2 });
        setIsCreateModalVisible(false);
        createForm.resetFields();
      } else {
        message.error({ content: 'Lỗi khi lưu tour', key: 'createTour', duration: 2 });
      }
    } catch (error) {
      if (error?.errorFields) {
        message.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      } else {
        message.error({ content: 'Lỗi hệ thống khi tạo tour', key: 'createTour', duration: 2 });
      }
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("price", values.price || 0);
      formData.append("discount", values.discount || 0);
      formData.append("stock", values.stock || 0);
      formData.append("status", values.status || "active");

      formData.append("position", values.position);
      formData.append("code", values.code);

      if (values.timeTour) formData.append("timeTour", values.timeTour);
      if (values.timeStart) formData.append("timeStart", values.timeStart.format("YYYY-MM-DD"));

      if (values.startDeparture) formData.append("startDeparture", values.startDeparture);
      if (values.endDeparture) formData.append("endDeparture", values.endDeparture);
      formData.append("information", values.information || "");
      formData.append("schedule", values.schedule || "");

      if (values.category_ids && values.category_ids.length > 0) {
        values.category_ids.forEach(id => formData.append("category_ids", id));
      }

      // Handle Image: separating already uploaded urls and raw binary files
      const existingImages = [];
      if (values.images && values.images.length > 0) {
        values.images.forEach(fileObj => {
          if (fileObj.url) {
            existingImages.push(fileObj.url);
          } else if (fileObj.originFileObj) {
            formData.append("images", fileObj.originFileObj);
          }
        });
      }
      formData.append("existingImages", existingImages.join(","));

      message.loading({ content: 'Đang cập nhật tour...', key: 'editTour' });
      const response = await editAdminTour(editTourId, formData);

      if (response && response.data) {
        await refetchTours();
        message.success({ content: 'Cập nhật tour thành công!', key: 'editTour', duration: 2 });
        setIsEditModalVisible(false);
        editForm.resetFields();
      } else {
        message.error({ content: 'Lỗi khi cập nhật tour', key: 'editTour', duration: 2 });
      }
    } catch (error) {
      if (error?.errorFields) {
        message.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      } else {
        message.error({ content: 'Lỗi hệ thống khi cập nhật tour', key: 'editTour', duration: 2 });
      }
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditTourId(null);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setDetailTourId(null);
  };

  const columns = [
    {
      title: <span className="text-gray-800 font-semibold">Hình ảnh</span>,
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <img
          src={images && images.length > 0 ? images[0] : 'https://placehold.co/150'}
          alt="tour poster"
          className="w-16 h-16 rounded-md object-cover shadow-sm border border-gray-100"
        />
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Thông tin Tour</span>,
      key: 'info',
      width: 350,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-gray-800 font-bold text-sm mb-1">{record.title}</span>
          <span className="text-gray-500 text-xs mb-0.5"><span className="font-medium text-gray-400">Mã:</span> {record.code}</span>
          <span className="text-gray-500 text-xs"><span className="font-medium text-gray-400">Thời gian:</span> {record.timeTour}</span>
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Lộ trình</span>,
      key: 'route',
      render: (_, record) => (
        <div className="flex flex-col items-start space-y-1">
          {record.startDeparture}
          <span className="text-gray-300 mx-2 text-[10px]">▼</span>
          {record.endDeparture}
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Giá</span>,
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span className="font-bold">
          {price?.toLocaleString()} đ
        </span>
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Số chỗ</span>,
      dataIndex: 'stock',
      key: 'stock',
      className: 'text-gray-600',
    },
    {
      title: <span className="text-gray-800 font-semibold">Trạng thái</span>,
      key: 'status',
      dataIndex: 'status',
      render: (status, record) => {
        let color = status === 'active' ? 'success' : 'error';
        const targetStatus = status === 'active' ? 'inactive' : 'active';
        const hasEditPerm = permissions.includes('tour-edit');

        const handleChangeStatus = async () => {
          if (!hasEditPerm) return;
          try {
            message.loading({ content: 'Đang cập nhật...', key: 'updateStatus' });
            await changeTourStatus(targetStatus, record._id);
            await refetchTours();
            message.success({ content: 'Cập nhật trạng thái thành công!', key: 'updateStatus', duration: 2 });
          } catch (error) {
            message.error({ content: 'Lỗi cập nhật trạng thái', key: 'updateStatus', duration: 2 });
          }
        };

        return (
          <Tooltip title={hasEditPerm ? "Nhấn để đổi trạng thái" : "Không có quyền đổi trạng thái"}>
            <Tag
              color={color}
              className={`rounded-full px-3 py-1 border-none font-medium ${hasEditPerm ? 'cursor-pointer hover:opacity-80 hover:shadow-sm transition-all' : 'cursor-not-allowed opacity-60'}`}
              onClick={handleChangeStatus}
            >
              {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: <span className="text-gray-800 font-semibold">Hành động</span>,
      key: 'actions',
      render: (_, record) => (
        <Space size="large">
          <Tooltip title={permissions.includes('tour-edit') ? "Chỉnh sửa" : "Không có quyền"}>
            <EditOutlined
              className={`text-lg transition-colors ${permissions.includes('tour-edit') ? 'text-gray-500 hover:text-primary cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={() => permissions.includes('tour-edit') && showEditModal(record._id)}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <EyeOutlined
              className="text-blue-500 text-lg hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => showDetailModal(record._id)}
            />
          </Tooltip>
          <Tooltip title={permissions.includes('tour-delete') ? "Xóa" : "Không có quyền"}>
            <Popconfirm
              title="Xoá tour này?"
              description="Bạn có chắc chắn muốn xoá Tour này không?"
              disabled={!permissions.includes('tour-delete')}
              onConfirm={async () => {
                try {
                  message.loading({ content: 'Đang xoá...', key: 'delTour' });
                  await deleteAdminTour(record._id);
                  message.success({ content: 'Đã xoá tour thành công!', key: 'delTour', duration: 2 });
                  refetchTours();
                } catch (err) {
                  message.error({ content: 'Lỗi hệ thống khi xoá', key: 'delTour', duration: 2 });
                }
              }}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className={`text-lg transition-colors ${permissions.includes('tour-delete') ? 'text-red-500 hover:text-red-600 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0" style={{ color: 'var(--color-text1)' }}>
            QUẢN LÝ TOUR
          </h1>
          <p className="text-gray-500 text-sm mt-1">Hệ thống danh sách điều hành Tour</p>
        </div>
        <Tooltip title={!permissions.includes('tour-create') && "Không có quyền thêm mới"}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="border-none font-semibold h-10 px-5 rounded hover:opacity-90 transition-opacity"
            style={{ backgroundColor: permissions.includes('tour-create') ? 'red' : '#d9d9d9' }}
            size="large"
            shape="round"
            onClick={permissions.includes('tour-create') ? showCreateModal : undefined}
            disabled={!permissions.includes('tour-create')}
          >
            Thêm mới
          </Button>
        </Tooltip>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Toolbar: Filters, Sort, Search */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Space size="middle" className="flex-wrap">
                {/* Filter */}
                <Select
                  value={queryParams.status}
                  style={{ width: 160 }}
                  onChange={(val) => setQueryParams(prev => ({ ...prev, status: val, page: 1 }))}
                  options={[
                    { value: '', label: 'Tất cả trạng thái' },
                    { value: 'active', label: 'Hoạt động' },
                    { value: 'inactive', label: 'Tạm dừng' },
                  ]}
                />
                {/* Sort */}
                <Select
                  value={`${queryParams.sortKey}-${queryParams.sortValue}`}
                  style={{ width: 220 }}
                  onChange={(val) => {
                    const [key, value] = val.split('-');
                    setQueryParams(prev => ({ ...prev, sortKey: key, sortValue: value, page: 1 }));
                  }}
                  options={[
                    { value: 'position-desc', label: 'Sắp xếp: Mặc định' },
                    { value: 'price-asc', label: 'Giá tăng dần' },
                    { value: 'price-desc', label: 'Giá giảm dần' },
                    { value: 'title-asc', label: 'Thứ tự A-Z' },
                    { value: 'title-desc', label: 'Thứ tự Z-A' },
                  ]}
                />
                {/* Search */}
                <Input.Search
                  placeholder="Tìm kiếm theo tên hoặc mã..."
                  allowClear
                  onSearch={(val) => setQueryParams(prev => ({ ...prev, keyword: val, page: 1 }))}
                  className="w-full sm:w-64"
                />
              </Space>
            </Col>
            <Col xs={24} md={8} className="text-right">
              <span className="text-gray-500 font-medium">
                Tìm thấy <strong className="text-primary mx-1">{pagination?.totalItems || tours.length}</strong> kết quả
              </span>
            </Col>
          </Row>
        </div>

        {/* Data Table */}
        <div className="p-0">
          <Skeleton active loading={loading} paragraph={{ rows: 10 }} className="p-6">
            <Table
              columns={columns}
              dataSource={tours}
              rowKey="_id"
              loading={false}
              pagination={{
                current: pagination?.currentPage || 1,
                pageSize: pagination?.limitItems || 5,
                total: pagination?.totalItems || tours.length,
                showSizeChanger: false,
                onChange: (page) => setQueryParams(prev => ({ ...prev, page }))
              }}
              className="w-full"
              rowClassName="hover:bg-gray-50/50 transition-colors"
            />
          </Skeleton>
        </div>
      </div>

      {/* Tour Modal */}
      <AddTourModal
        visible={isCreateModalVisible}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        form={createForm}
      />

      <EditTourModal
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        form={editForm}
        tourId={editTourId}
      />

      <DetailTourModal
        visible={isDetailModalVisible}
        onCancel={handleDetailCancel}
        tourId={detailTourId}
      />
    </div>
  );
}

export default AdminTours;