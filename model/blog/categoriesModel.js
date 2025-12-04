import mongoose from "mongoose";

const CategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    current: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const categories = mongoose.model("Categories", CategoriesSchema);

export default categories;

// Sub Category Schema
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    }, // join here
  },
  { timestamps: true }
);

export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
