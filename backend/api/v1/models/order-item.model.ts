import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const orderItemSchema = new mongoose.Schema(
  {
    orderId: String,
    tourId: String,
    quantity: Number,
    price: Number,
    discount: Number,
    timeStart: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema, "order_items");

export default OrderItem;
