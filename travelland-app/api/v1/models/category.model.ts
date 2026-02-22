import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const categorySchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    description: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true
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

const Category = mongoose.model("Category", categorySchema, "categories");

export default Category;
