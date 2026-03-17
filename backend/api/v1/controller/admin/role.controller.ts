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
      message: "Get roles successfully!",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const records = new Role(req.body);
    await records.save();
    res.status(201).json({
      message: "Create role successfully!",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Role.updateOne({ _id: id }, req.body);
    res.status(200).json({
      message: "Update role successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
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
      message: "Delete role successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
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
      message: "Get permissions successfully!",
      data: records
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    res.status(200).json({
      message: "Update permissions successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};