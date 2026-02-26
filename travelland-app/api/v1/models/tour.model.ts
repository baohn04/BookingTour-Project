import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const tourSchema = new mongoose.Schema(
  {
    title: String,
    code: String,
    images: {
      type: Array,
      default: [],
    },
    price: Number,
    discount: Number,
    information: String,
    schedule: String,
    timeStart: Date,
    startDeparture: String,
    endDeparture: String,
    timeTour: String,
    stock: Number,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
    },
    category_ids: {
      type: Array,
      default: [],
    },
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

const Tour = mongoose.model("Tour", tourSchema, "tours");

export default Tour;
