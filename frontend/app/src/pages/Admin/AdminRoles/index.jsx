import React, { useState } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, message, Skeleton, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAdminRoles } from '../../../hooks/useAdminRoles';
import { createAdminRole, editAdminRole, deleteAdminRole, updatePermissions } from '../../../services/adminRoleServices';
import AddRoleModal from '../../../features/AdminRolesFeature/AddRoleModal';
import EditRoleModal from '../../../features/AdminRolesFeature/EditRoleModal';
import PermissionsModal from '../../../features/AdminRolesFeature/PermissionsModal';

function AdminRoles() {
  const { roles, loading, refetchRoles } = useAdminRoles();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPermissionsModalVisible, setIsPermissionsModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // --- Handlers ---
  const showCreateModal = () => setIsAddModalVisible(true);

  const showEditModal = (id) => {
    setEditId(id);
    setIsEditModalVisible(true);
  };

  const handleAddCancel = () => {
    createForm.resetFields();
    setIsAddModalVisible(false);
  };

  const handleEditCancel = () => {
    editForm.resetFields();
    setIsEditModalVisible(false);
  };

  const handleCreateOk = async () => {
    try {
      const values = await createForm.validateFields();
      message.loading({ content: 'Đang tạo nhóm quyền...', key: 'createRole' });
      await createAdminRole(values);
      message.success({ content: 'Tạo nhóm quyền thành công!', key: 'createRole', duration: 2 });
      handleAddCancel();
      refetchRoles();
    } catch (error) {
      if (!error.errorFields) {
        message.error({ content: error?.response?.data?.message || 'Có lỗi xảy ra!', key: 'createRole', duration: 2 });
      }
    }
  };

  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      message.loading({ content: 'Đang cập nhật...', key: 'editRole' });
      await editAdminRole(editId, values);
      message.success({ content: 'Cập nhật thành công!', key: 'editRole', duration: 2 });
      handleEditCancel();
      refetchRoles();
    } catch (error) {
      if (!error.errorFields) {
        message.error({ content: error?.response?.data?.message || 'Có lỗi xảy ra!', key: 'editRole', duration: 2 });
      }
    }
  };

  const handlePermissionsOk = async () => {
    setPermissionsLoading(true);
    try {
      const table = document.querySelector('[data-permissions-table]');
      const rows = table.querySelectorAll('[data-name]');
      let permissions = [];

      rows.forEach((row) => {
        const name = row.getAttribute("data-name");
        const inputs = row.querySelectorAll("input");
        
        if (name === "id") {
          inputs.forEach((input) => {
            const id = input.value;
            permissions.push({
              id: id,
              permissions: []
            });
          });
        } else {
          inputs.forEach((input, index) => {
            const checked = input.checked;
            if (checked) {
              permissions[index].permissions.push(name);
            }
          });
        }
      });

      if (permissions.length > 0) {
        message.loading({ content: 'Đang cập nhật phân quyền...', key: 'perm' });
        await updatePermissions({ permissions: JSON.stringify(permissions) });
        message.success({ content: 'Phân quyền thành công!', key: 'perm', duration: 2 });
        
        setIsPermissionsModalVisible(false);
        refetchRoles();
      }
    } catch (error) {
      console.error("Permissions error:", error);
      message.error({ content: 'Có lỗi xảy ra khi phân quyền', key: 'perm', duration: 2 });
    } finally {
      setPermissionsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      message.loading({ content: 'Đang xóa...', key: 'delRole' });
      await deleteAdminRole(id);
      message.success({ content: 'Đã xóa nhóm quyền!', key: 'delRole', duration: 2 });
      refetchRoles();
    } catch (error) {
      message.error({ content: 'Lỗi khi xóa nhóm quyền', key: 'delRole', duration: 2 });
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      render: (_, __, index) => <span className="text-gray-500 font-medium">{index + 1}</span>,
    },
    {
      title: 'Tên nhóm quyền',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span className="font-bold text-gray-800">{text}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <span className="text-gray-500 text-sm whitespace-pre-line">{text || '---'}</span>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <EditOutlined
              className="text-blue-500 text-lg hover:text-blue-600 cursor-pointer"
              onClick={() => showEditModal(record._id)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa nhóm quyền này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className="text-red-500 text-lg hover:text-red-600 cursor-pointer" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-0">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0 flex items-center gap-2 uppercase">
            Quản lý phân quyền
          </h1>
          <p className="text-gray-500 text-sm mt-1">Danh sách vai trò và phân quyền quản trị</p>
        </div>

        <Space size="middle">
          <Button
            icon={<CheckCircleOutlined />}
            size="large"
            className="rounded-md flex items-center shadow-sm font-medium border-gray-300"
            onClick={() => setIsPermissionsModalVisible(true)}
          >
            Phân quyền
          </Button>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{ backgroundColor: 'red' }}
            className="rounded-md flex items-center shadow-sm font-medium bg-primary border-none"
            onClick={showCreateModal}
          >
            Thêm mới
          </Button>
        </Space>
      </div>


      {/* Content Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-base font-semibold text-gray-700 m-0">Danh mục vai trò hiện tại</h2>
        </div>

        <div className="p-0">
          <Skeleton active loading={loading} paragraph={{ rows: 6 }} className="p-6">
            <Table
              columns={columns}
              dataSource={roles}
              rowKey="_id"
              pagination={false}
              className="w-full"
              rowClassName="hover:bg-gray-50/50 transition-colors"
            />
          </Skeleton>
        </div>
      </div>

      {/* Modals */}
      <AddRoleModal
        visible={isAddModalVisible}
        onOk={handleCreateOk}
        onCancel={handleAddCancel}
        form={createForm}
      />

      <EditRoleModal
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        form={editForm}
        roleId={editId}
      />

      <PermissionsModal
        visible={isPermissionsModalVisible}
        onCancel={() => setIsPermissionsModalVisible(false)}
        onOk={handlePermissionsOk}
        roles={roles}
        loading={permissionsLoading}
      />
    </div>
  );
}

export default AdminRoles;