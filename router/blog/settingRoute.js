import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import {
  deleteSetting,
  getAllSettings,
  getAllSettingsById,
  insertsetting,
  updatesetting,
} from "../../controller/blog/settingController.js";
import upload from "../../middleware/upload.js";
const router = express.Router();

router.post(
  "/insertSetting",
  upload.single("bgImage"),
  verifyToken,
  insertsetting
);

router.get(
  "/getsetting",
  //verifyToken,
  getAllSettings
);

router.get("/getsettingById/:id", getAllSettingsById);

router.put(
  "/updateAllSettingById/:id",
  upload.single("bgImage"),
  verifyToken,
  updatesetting
);

router.delete("/deletesetting", deleteSetting);

export default router;
