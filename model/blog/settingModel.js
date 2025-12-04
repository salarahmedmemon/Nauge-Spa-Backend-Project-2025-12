import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
    },

    bgImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
