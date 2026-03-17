import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import Order from "../../models/order.model";
import Admin from "../../models/admin.model";

// [GET] /admin/dashboard
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    // Thống kê tổng quan
    const totalTours = await Tour.countDocuments({ deleted: false });
    const activeTours = await Tour.countDocuments({ deleted: false, status: "active" });

    const totalCategories = await Category.countDocuments({ deleted: false });
    const activeCategories = await Category.countDocuments({ deleted: false, status: "active" });

    const totalOrders = await Order.countDocuments({ deleted: false });
    const pendingOrders = await Order.countDocuments({ deleted: false, status: "pending" });
    const confirmedOrders = await Order.countDocuments({ deleted: false, status: "confirmed" });
    const cancelledOrders = await Order.countDocuments({ deleted: false, status: "cancelled" });

    const totalAdmins = await Admin.countDocuments({ deleted: false });
    const activeAdmins = await Admin.countDocuments({ deleted: false, status: "active" });

    // Lấy 5 đơn hàng mới nhất
    const recentOrders = await Order.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(5).select("-__v -deletedAt -createdAt -updatedAt");

    // Lấy 5 tour mới nhất
    const recentTours = await Tour.find({ deleted: false })
      .sort({ createdAt: -1 })
      .limit(5).select("-__v -deletedAt -createdAt -updatedAt");

    res.status(200).json({
      message: "Success",
      statistics: {
        tours: {
          total: totalTours,
          active: activeTours
        },
        categories: {
          total: totalCategories,
          active: activeCategories
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          cancelled: cancelledOrders
        },
        admins: {
          total: totalAdmins,
          active: activeAdmins
        }
      },
      recentOrders: recentOrders,
      recentTours: recentTours
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: error.message
    });
  }
};
