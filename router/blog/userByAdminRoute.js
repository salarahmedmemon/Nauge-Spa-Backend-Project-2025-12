import express from "express";
import {
  authStatus,
  deleteUser,
  forgotPassword,
  getAlluser,
  getAllUserById,
  insertUser,
  login,
  logOut,
  resetPassword,
  updateUser,
} from "../../controller/blog/userByAdminController.js";
import {
  userRegistrationRules,
  userLoginRules,
  validateUser,
} from "./../../middleware/userValidation.js";
import {
  forgetpassword,
  resetpassword,
  validateforget_resetpassword,
} from "../../middleware/forget_resetPasswordValidation.js";

const router = express.Router();

router.post("/insertUser", userRegistrationRules, validateUser, insertUser);

router.post("/login", userLoginRules, validateUser, login);

router.post("/logout", logOut);

router.get("/checkauth", authStatus);

router.get("/getalluser", getAlluser);

router.get("/getalluserbyid/:id", getAllUserById);

router.put("/updateUser/:id", updateUser);

router.delete("/deleteUser/:id", deleteUser);

router.post("/forgot-password", forgetpassword,validateforget_resetpassword, forgotPassword);

router.post("/reset-password/:token", resetpassword,validateforget_resetpassword, resetPassword);

export default router;
