import React, { useState } from 'react';
import {
  Table, Button, Input, Tag, Space, Tooltip, Form, Select, Row, Col, message, Popconfirm, Skeleton
} from 'antd';
import { useSelector } from 'react-redux';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

import { useAdminCategories } from '../../../hooks/useAdminCategories';
import {
  changeCategoryStatus,
  createAdminCategory,
  editAdminCategory,
  deleteAdminCategory,
  getAdminDetailCategory,
} from '../../../services/adminCategoryServices';

import AddCategoryModal from '../../../features/AdminCategoriesFeature/AddCategoryModal';
import EditCategoryModal from '../../../features/AdminCategoriesFeature/EditCategoryModal';
import DetailCategoryModal from '../../../features/AdminCategoriesFeature/DetailCategoryModal';

function AdminCategories() {
  const { categories, pagination, loading, refetchCategories, queryParams, setQueryParams } = useAdminCategories();
  const permissions = useSelector(state => state.account?.userInfo?.role?.permissions || []);

  // Modal states
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [detailCategory, setDetailCategory] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // --- Show Handlers ---
  const showCreateModal = () => setIsCreateVisible(true);

  const showEditModal = (id) => {
    setEditCategoryId(id);
    setIsEditVisible(true);
  };

  const showDetailModal = async (id) => {
    setIsDetailVisible(true);
    setDetailLoading(true);
    try {
      const res = await getAdminDetailCategory(id);
      if (res && res.data) setDetailCategory(res.data);
    } catch {
      message.error('Không thể tải chi tiết danh mục!');
    } finally {
      setDetailLoading(false);
    }
  };

  // --- Create Handler ---
  const handleCreateOk = async () => {
    try {
      const values = await createForm.validateFields();
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("status", values.status || "active");

      if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      message.loading({ content: 'Đang lưu danh mục...', key: 'createCat' });
      const response = await createAdminCategory(formData);

      if (response && response.data) {
        await refetchCategories();
        message.success({ content: 'Tạo danh mục thành công!', key: 'createCat', duration: 2 });
        setIsCreateVisible(false);
        createForm.resetFields();
      } else {
        message.error({ content: response?.message || 'Lỗi khi tạo danh mục', key: 'createCat', duration: 2 });
      }
    } catch (error) {
      if (error?.errorFields) {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      } else {
        message.error({ content: 'Lỗi hệ thống!', key: 'createCat', duration: 2 });
      }
    }
  };

  // --- Edit Handler ---
  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("status", values.status || "active");
      formData.append("position", values.position);

      // Handle image: nếu là file mới thì upload, nếu là url cũ thì bỏ qua
      if (values.image && values.image.length > 0) {
        const imgItem = values.image[0];
        if (imgItem.originFileObj) {
          formData.append("image", imgItem.originFileObj);
        }
      }

      message.loading({ content: 'Đang cập nhật danh mục...', key: 'editCat' });
      const response = await editAdminCategory(editCategoryId, formData);

      if (response && response.message) {
        await refetchCategories();
        message.success({ content: 'Cập nhật danh mục thành công!', key: 'editCat', duration: 2 });
        setIsEditVisible(false);
        editForm.resetFields();
      } else {
        message.error({ content: 'Lỗi khi cập nhật danh mục', key: 'editCat', duration: 2 });
      }
    } catch (error) {
      if (error?.errorFields) {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      } else {
        message.error({ content: 'Lỗi hệ thống!', key: 'editCat', duration: 2 });
      }
    }
  };

  // --- Column definitions ---
  const columns = [
    {
      title: <span className="text-gray-800 font-semibold">Hình ảnh</span>,
      dataIndex: 'image',
      key: 'image',
      width: 90,
      render: (image) => (
        <img
          src={image || 'https://placehold.co/64x64?text=N/A'}
          alt="category"
          className="w-14 h-14 rounded-lg object-cover shadow-sm border border-gray-100"
          onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=N/A'; }}
        />
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Thông tin</span>,
      key: 'info',
      width: 300,
      render: (_, record) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-gray-800 font-bold text-sm">{record.title}</span>
        </div>
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Mô tả</span>,
      dataIndex: 'description',
      key: 'description',
      render: (desc) => (
        <span className="text-gray-500 text-sm line-clamp-2">
          {desc || <span className="italic text-gray-300">Chưa có mô tả</span>}
        </span>
      ),
    },
    {
      title: <span className="text-gray-800 font-semibold">Vị trí</span>,
      dataIndex: 'position',
      key: 'position',
      width: 80,
      align: 'center',
      render: (pos) => <span className="font-semibold text-gray-600">#{pos}</span>,
    },
    {
      title: <span className="text-gray-800 font-semibold">Trạng thái</span>,
      key: 'status',
      dataIndex: 'status',
      width: 140,
      render: (status, record) => {
        const targetStatus = status === 'active' ? 'inactive' : 'active';
        const hasEditPerm = permissions.includes('category-edit');

        const handleChangeStatus = async () => {
          if (!hasEditPerm) return;
          try {
            message.loading({ content: 'Đang cập nhật...', key: 'updateCatStatus' });
            await changeCategoryStatus(targetStatus, record._id);
            await refetchCategories();
            message.success({ content: 'Cập nhật trạng thái thành công!', key: 'updateCatStatus', duration: 2 });
          } catch {
            message.error({ content: 'Lỗi cập nhật trạng thái', key: 'updateCatStatus', duration: 2 });
          }
        };

        return (
          <Tooltip title={hasEditPerm ? "Nhấn để đổi trạng thái" : "Không có quyền đổi trạng thái"}>
            <Tag
              color={status === 'active' ? 'success' : 'error'}
              className={`rounded-full px-3 py-1 border-none font-medium ${hasEditPerm ? 'cursor-pointer hover:opacity-80 transition-all' : 'cursor-not-allowed opacity-60'}`}
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
      width: 130,
      render: (_, record) => (
        <Space size="large">
          <Tooltip title={permissions.includes('category-edit') ? "Chỉnh sửa" : "Không có quyền"}>
            <EditOutlined
              className={`text-lg transition-colors ${permissions.includes('category-edit') ? 'text-gray-500 hover:text-primary cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
              onClick={() => permissions.includes('category-edit') && showEditModal(record._id)}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <EyeOutlined
              className="text-blue-500 text-lg hover:text-blue-600 transition-colors cursor-pointer"
              onClick={() => showDetailModal(record._id)}
            />
          </Tooltip>
          <Tooltip title={permissions.includes('category-delete') ? "Xoá" : "Không có quyền"}>
            <Popconfirm
              title="Xoá danh mục này?"
              description="Thao tác này không thể hoàn tác!"
              disabled={!permissions.includes('category-delete')}
              onConfirm={async () => {
                try {
                  message.loading({ content: 'Đang xoá...', key: 'delCat' });
                  await deleteAdminCategory(record._id);
                  await refetchCategories();
                  message.success({ content: 'Xoá danh mục thành công!', key: 'delCat', duration: 2 });
                } catch {
                  message.error({ content: 'Lỗi khi xoá danh mục', key: 'delCat', duration: 2 });
                }
              }}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className={`text-lg transition-colors ${permissions.includes('category-delete') ? 'text-red-500 hover:text-red-600 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold m-0" style={{ color: 'var(--color-text1)' }}>
            QUẢN LÝ DANH MỤC
          </h1>
          <p className="text-gray-500 text-sm mt-1">Hệ thống phân loại Danh mục Tour</p>
        </div>
        <Tooltip title={!permissions.includes('category-create') && "Không có quyền thêm mới"}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="border-none font-semibold h-10 px-5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: permissions.includes('category-create') ? 'red' : '#d9d9d9' }}
            size="large"
            shape="round"
            onClick={permissions.includes('category-create') ? showCreateModal : undefined}
            disabled={!permissions.includes('category-create')}
          >
            Thêm mới
          </Button>
        </Tooltip>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col xs={24} md={18}>
              <Space size="middle" className="flex-wrap">
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
                <Select
                  value={`${queryParams.sortKey}-${queryParams.sortValue}`}
                  style={{ width: 200 }}
                  onChange={(val) => {
                    const [key, value] = val.split('-');
                    setQueryParams(prev => ({ ...prev, sortKey: key, sortValue: value, page: 1 }));
                  }}
                  options={[
                    { value: 'position-desc', label: 'Sắp xếp: Mặc định' },
                    { value: 'position-asc', label: 'Vị trí tăng dần' },
                    { value: 'title-asc', label: 'Thứ tự A-Z' },
                    { value: 'title-desc', label: 'Thứ tự Z-A' },
                  ]}
                />
                <Input.Search
                  placeholder="Tìm kiếm theo tên danh mục..."
                  allowClear
                  onSearch={(val) => setQueryParams(prev => ({ ...prev, keyword: val, page: 1 }))}
                  style={{ width: 260 }}
                />
              </Space>
            </Col>
            <Col xs={24} md={6} className="text-right">
              <span className="text-gray-500 font-medium">
                Tìm thấy <strong className="text-primary mx-1">{pagination?.totalItems || categories.length}</strong> kết quả
              </span>
            </Col>
          </Row>
        </div>

        {/* Table Area with Skeleton */}
        <div className="p-0">
          <Skeleton active loading={loading} paragraph={{ rows: 10 }} className="p-6">
            <Table
              columns={columns}
              dataSource={categories}
              rowKey="_id"
              loading={false}
              pagination={{
                current: pagination?.currentPage || 1,
                pageSize: pagination?.limitItems || 5,
                total: pagination?.totalItems || categories.length,
                showSizeChanger: false,
                onChange: (page) => setQueryParams(prev => ({ ...prev, page })),
              }}
              rowClassName="hover:bg-gray-50/50 transition-colors"
            />
          </Skeleton>
        </div>
      </div>

      {/* Modals */}
      <AddCategoryModal
        visible={isCreateVisible}
        onOk={handleCreateOk}
        onCancel={() => { setIsCreateVisible(false); createForm.resetFields(); }}
        form={createForm}
      />

      <EditCategoryModal
        visible={isEditVisible}
        onOk={handleEditOk}
        onCancel={() => { setIsEditVisible(false); setEditCategoryId(null); }}
        form={editForm}
        categoryId={editCategoryId}
      />

      <DetailCategoryModal
        visible={isDetailVisible}
        onCancel={() => { setIsDetailVisible(false); setDetailCategory(null); }}
        category={detailCategory}
        loading={detailLoading}
      />
    </div>
  );
}

export default AdminCategories;