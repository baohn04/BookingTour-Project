import { Server, Socket } from "socket.io";
import Order from "../../models/order.model";
import OrderItem from "../../models/order-item.model";
import Tour from "../../models/tour.model";

const orderSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("CLIENT_ORDER_SUCCESS", async (orderCode: string) => {
      try {
        const order = await Order.findOne({ code: orderCode });
        if (!order) return;

        const orderItems = await OrderItem.find({ orderId: order.id }).lean() as any[];

        const toursData = [];
        for (const item of orderItems) {
          const tourInfo = await Tour.findOne({ _id: item.tourId }).select("title images").lean();
          if (tourInfo) {
            toursData.push({
              title: tourInfo.title,
              image: tourInfo.images?.[0] || "",
              quantity: item.quantity
            });
          }
        }

        const orderItemData = {
          fullName: order.fullName,
          tours: toursData
        };

        socket.broadcast.emit("SERVER_ORDER_SUCCESS", orderItemData);
      } catch (error) {
        console.error("Lỗi socket CLIENT_ORDER_SUCCESS:", error);
      }
    });
  });
};

export default orderSocket;
