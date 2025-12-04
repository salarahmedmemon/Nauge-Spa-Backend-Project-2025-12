import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["info", "success", "error", "warning"],
      default: "info",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userByAdmin",
    },
    relatedModel: {
      type: String,
      required: false,
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
