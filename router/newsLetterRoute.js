import express from "express";
import {
  fetchAllUser,
  insertuser,
  sendingEmail,
} from "../controller/newsLatterController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  userRegistrationRules,
  validateUser,
} from "../middleware/newLetterValidation.js";
import { emailRules, validateemail } from "../middleware/newsLetterEmailValidation.js";

const router = express.Router();

router.post(
  "/insertUser",
  verifyToken,
  userRegistrationRules,
  validateUser,
  insertuser
);

router.get("/getAllUser", verifyToken, fetchAllUser);

router.post("/send-mail", emailRules,validateemail, sendingEmail);

export default router;
