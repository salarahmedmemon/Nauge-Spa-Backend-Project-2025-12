import express from "express";
import { getRecentNotifications } from "../../controller/blog/NotificationController.js";

const router=express.Router();

router.get('/recent', getRecentNotifications)

export default router;

