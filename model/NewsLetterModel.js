import mongoose from "mongoose";

const newsLetterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const newsletter = mongoose.model("news_latter", newsLetterSchema);


export default newsletter;