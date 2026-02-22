import { Request, Response } from "express";
import Order from "../../models/order.model";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";
import { generateOrderCode } from "../../../../helpers/generate";

// [POST] /order/
export const order = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Lưu data.info vào bảng orders
    const dataOrder = {
      code: "",
      fullName: data.info.fullName,
      phone: data.info.phone,
      note: data.info.note,
      status: "pending",
    };

    const order = new Order(dataOrder);
    await order.save();

    const orderId = order.id;

    const code = generateOrderCode(orderId);
    await Order.updateOne(
      {
        _id: orderId,
      },
      {
        code: code,
      }
    );

    // Lưu data.cart vào bảng orders_item
    for (const item of data.cart) {
      const dataItem = {
        orderId: orderId,
        tourId: item.tourId,
        quantity: item.quantity,
      };

      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false,
        status: "active",
      });

      if (infoTour) {
        dataItem["price"] = infoTour.price;
        dataItem["discount"] = infoTour.discount;
        dataItem["timeStart"] = infoTour.timeStart;
      }

      await new OrderItem(dataItem).save();
    }

    res.status(201).json({
      message: "Booking tour successfully!",
      data: {
        orderCode: code,
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// [GET] /order/success
export const orderSuccess = async (req: Request, res: Response) => {
  try {
    const orderCode = req.query.orderCode;

    const order = await Order.findOne({
      code: orderCode,
      deleted: false,
    }).select("-__v -createdAt -updatedAt").lean();
    if (!order) {
      res.status(404).json({
        message: "Order not found"
      });
      return;
    }

    const orderItems = await OrderItem.find({
      orderId: order._id.toString(),
    }).select("-__v -createdAt -updatedAt").lean() as any[];

    for (const item of orderItems) {
      item["price_special"] = item.price * (1 - item.discount / 100);
      item["total"] = item["price_special"] * item.quantity;

      const tourInfo = await Tour.findOne({
        _id: item.tourId
      }).select("-__v -createdAt -updatedAt").lean();

      if (tourInfo) {
        item["title"] = tourInfo.title;
        item["slug"] = tourInfo.slug;
        item["image"] = tourInfo.images?.[0] || "";
      }
    }

    const totalPrice = orderItems.reduce((sum, item) => sum + (item["total"] || 0), 0);

    res.status(200).json({
      message: "Success",
      data: {
        order: {
          ...order,
          total_price: totalPrice
        },
        orderItems: orderItems
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
