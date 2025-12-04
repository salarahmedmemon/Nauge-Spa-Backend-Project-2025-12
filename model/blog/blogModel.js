import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userByAdmin",
      required: false,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    tags: [{ type: String, required: true }],
    featured: {
      type: Boolean,
      required: true,
    },
    blogImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const blog = mongoose.model("blogs", BlogSchema);

export default blog;
