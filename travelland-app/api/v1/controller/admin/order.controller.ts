import { Request, Response } from "express";
import Order from "../../models/order.model";
import paginationHelper from "../../../../helpers/pagination";
import OrderItem from "../../models/order-item.model";
import Tour from "../../models/tour.model";

// Order status list for filter
const ORDER_STATUS_LIST = [
  { status: "", label: "Tất cả" },
  { status: "pending", label: "Chờ xử lý" },
  { status: "confirmed", label: "Đã xác nhận" },
  { status: "cancelled", label: "Đã hủy" }
];

// [GET] /admin/orders
export const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const find = {
      deleted: false,
    };

    // Filter Status
    const filterStatus = ORDER_STATUS_LIST.map(item => ({
      ...item,
      checked: req.query.status === item.status
    }));

    if (req.query.status) {
      find["status"] = req.query.status.toString();
    }
    // End Filter Status

    // Search
    const keyword: string = (req.query.keyword as string) || "";

    if (keyword && keyword !== "undefined") {
      const keywordRegex = new RegExp(keyword, "i");
      find["$or"] = [
        { code: keywordRegex },
        { fullName: keywordRegex },
        { phone: keywordRegex }
      ];
    }
    // End Search

    // Pagination
    const initPagination = {
      currentPage: 1,
      limitItems: 5,
    };

    const countOrders: number = await Order.countDocuments(find);
    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countOrders
    );
    // End Pagination

    const orders = await Order.find(find)
      .sort({ createdAt: -1 })
      .skip(objectPagination.skip || 0)
      .limit(objectPagination.limitItems);

    // Statistics
    const statistics = {
      total: await Order.countDocuments({ deleted: false }),
      pending: await Order.countDocuments({ deleted: false, status: "pending" }),
      confirmed: await Order.countDocuments({ deleted: false, status: "confirmed" }),
      cancelled: await Order.countDocuments({ deleted: false, status: "cancelled" })
    };

    res.status(200).json({
      message: "Get list orders successfully!",
      data: {
        orders: orders,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: objectPagination,
        statistics: statistics
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [GET] /admin/orders/detail/:id
export const detail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;
    const order = await Order.findOne({
      _id: id,
      deleted: false
    });

    if (!order) {
      res.status(404).json({
        message: "Order not found!"
      });
      return;
    }

    const orderItems = await OrderItem.find({
      orderId: order.id,
      deleted: false
    });

    for (const item of orderItems) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active"
      });

      if (infoTour) {
        item["info"] = infoTour;
        item["image"] = "";

        if (infoTour.images && infoTour.images.length > 0) {
          item["image"] = infoTour.images[0];
        }

        item["price_special"] = infoTour.price * (1 - infoTour.discount / 100);
        item["total"] = item["price_special"] * item["quantity"];
      }
    }

    res.status(200).json({
      message: "Get order detail successfully!",
      data: {
        order: order,
        orderItems: orderItems
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [PATCH] /admin/orders/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Order.updateOne({ _id: id }, { status: status });

    res.status(200).json({
      message: "Update status order successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [DELETE] /admin/orders/delete/:id
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const id: string = req.params.id;

    await Order.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );

    res.status(200).json({
      message: "Delete order successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};