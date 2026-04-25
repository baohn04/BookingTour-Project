import { Request, Response } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../../../config/system";


// [GET] /admin/roles
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find = {
      deleted: false
    };

    const records = await Role.find(find);

    res.status(200).json({
      message: "Lấy danh sách role thành công",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = new Role(req.body);
    await records.save();
    res.status(201).json({
      message: "Tạo nhóm quyền thành công",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;
    const record = await Role.findOne({
      _id: id,
      deleted: false
    });

    if (!record) {
      res.status(404).json({ message: "Không tìm thấy nhóm quyền" });
      return;
    }

    res.status(200).json({
      message: "Lấy chi tiết nhóm quyền thành công",
      data: record
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Role.updateOne({ _id: id }, req.body);
    res.status(200).json({
      message: "Cập nhật role thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [DELETE] /admin/roles/delete/:id
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Role.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    res.status(200).json({
      message: "Xóa role thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const find = {
      deleted: false
    };

    const records = await Role.find(find);

    res.status(200).json({
      message: "Lấy danh sách phân quyền thành công",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    interface PermissionItem {
      id: string;
      permissions: string[];
    }

    const permissions: PermissionItem[] = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    res.status(200).json({
      message: "Cập nhật phân quyền thành công",
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Đã có lỗi xảy ra"
    });
  }
};