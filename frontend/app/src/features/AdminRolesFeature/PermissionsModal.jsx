import React from 'react';
import { Modal, Checkbox, Button, Tag, Space } from 'antd';
import { SaveOutlined, SafetyCertificateOutlined, SafetyOutlined, CheckSquareOutlined, BorderOutlined } from '@ant-design/icons';

function PermissionsModal({ visible, onCancel, onOk, roles, loading }) {
  // Logic Chọn tất cả (Select All)
  const handleSelectAll = () => {
    const checkboxes = document.querySelectorAll('[data-permissions-table] input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (!cb.checked) cb.click();
    });
  };

  // Logic Bỏ chọn tất cả (Deselect All)
  const handleDeselectAll = () => {
    const checkboxes = document.querySelectorAll('[data-permissions-table] input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (cb.checked) cb.click();
    });
  };

  const permissionGroups = [
    {
      title: "Danh mục tour",
      permissions: [
        { name: "category-view", label: "Xem danh mục" },
        { name: "category-create", label: "Thêm mới danh mục" },
        { name: "category-edit", label: "Chỉnh sửa danh mục" },
        { name: "category-delete", label: "Xóa danh mục" },
      ]
    },
    {
      title: "Danh sách tour",
      permissions: [
        { name: "tour-view", label: "Xem danh sách tour" },
        { name: "tour-create", label: "Thêm mới tour" },
        { name: "tour-edit", label: "Chỉnh sửa tour" },
        { name: "tour-delete", label: "Xóa tour" },
      ]
    },
    {
      title: "Quản lý đơn hàng",
      permissions: [
        { name: "order-view", label: "Xem danh sách đơn hàng" },
        { name: "order-edit", label: "Cập nhật đơn hàng" },
        { name: "order-delete", label: "Xóa đơn hàng" },
      ]
    },
    {
      title: "Nhóm quyền & Phân quyền",
      permissions: [
        { name: "role-view", label: "Xem nhóm quyền" },
        { name: "role-create", label: "Thêm mới nhóm quyền" },
        { name: "role-edit", label: "Chỉnh sửa nhóm quyền" },
        { name: "role-delete", label: "Xóa nhóm quyền" },
        { name: "role-permissions", label: "Thực hiện phân quyền" },
      ]
    },
    {
      title: "Tài khoản trị viên",
      permissions: [
        { name: "account-view", label: "Xem danh sách tài khoản" },
        { name: "account-create", label: "Thêm mới tài khoản" },
        { name: "account-edit", label: "Chỉnh sửa tài khoản" },
        { name: "account-delete", label: "Xóa tài khoản" },
      ]
    }
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
          <SafetyCertificateOutlined className="text-2xl" />
          <span>PHÂN QUYỀN HỆ THỐNG</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1200}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel} className="rounded-md px-6">
          Đóng
        </Button>,
        <Button
          key="submit"
          type="primary"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={onOk}
          className="rounded-md bg-blue border-none px-8 font-medium"
        >
          Lưu thay đổi
        </Button>
      ]}
      forceRender
    >
      {/* Thanh công cụ thao tác nhanh */}
      <div className="mb-4 flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
        <div className="text-gray-500 text-sm font-medium">
          <SafetyOutlined className="mr-2" />
          Công cụ thao tác nhanh:
        </div>
        <Space>
          <Button
            size="small"
            icon={<CheckSquareOutlined />}
            onClick={handleSelectAll}
            className="text-blue-600 border-blue-200 hover:text-blue-700 hover:border-blue-300"
          >
            Chọn tất cả
          </Button>
          <Button
            size="small"
            icon={<BorderOutlined />}
            onClick={handleDeselectAll}
            className="text-gray-600 border-gray-300 hover:text-gray-700 hover:border-gray-400"
          >
            Bỏ chọn tất cả
          </Button>
        </Space>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse" data-permissions-table>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-700 w-1/4">Tính năng / Chức năng</th>
              {roles.map(role => (
                <th key={role._id} className="p-4 font-bold text-gray-700 text-center border-l border-gray-100 min-w-[120px]">
                  <Tag color="blue" className="m-0 border-none font-bold uppercase">{role.title}</Tag>
                </th>
              ))}
            </tr>
            {/* Dòng ID ẩn dùng cho logic thu thập dữ liệu */}
            <tr className="hidden" data-name="id">
              <td></td>
              {roles.map(role => (
                <td key={role._id}>
                  <input type="text" value={role._id} readOnly />
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionGroups.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <tr className="bg-blue-50/20">
                  <td colSpan={roles.length + 1} className="p-3 pl-4 font-bold text-blue-800 uppercase text-xs tracking-wider flex items-center gap-2">
                    <SafetyOutlined />
                    {group.title}
                  </td>
                </tr>
                {group.permissions.map((perm, pIdx) => (
                  <tr key={perm.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors" data-name={perm.name}>
                    <td className="p-4 text-gray-600 pl-8 font-medium">{perm.label}</td>
                    {roles.map((role, rIdx) => (
                      <td key={role._id} className="p-4 text-center border-l border-gray-50">
                        <Checkbox
                          defaultChecked={role.permissions?.includes(perm.name)}
                          className="scale-125"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <span className="text-gray-400 text-xs italic">* Vui lòng kiểm tra kỹ trước khi cập nhật các quyền hạn quan trọng</span>
      </div>
    </Modal>
  );
}

export default PermissionsModal;
