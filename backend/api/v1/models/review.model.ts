import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const reviewSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    comment: String,
    rating: Number,
    tourId: String,
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

const Review = mongoose.model("Review", reviewSchema, "reviews");

export default Review;
