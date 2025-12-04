import { userByAdmin } from "../../model/blog/userByAdminModel.js";
import NotificationModel from "../../model/blog/NotificationModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendEmail from "../../router/utils/sendEmail.js";

export const insertUser = async (req, res) => {
  try {
    const { fullName, role, email, confirmedPassword, phone, address } =
      req.body;
    const hasedPassword = await bcrypt.hash(confirmedPassword, 10);

    const newUser = new userByAdmin({
      fullName,
      role,
      email,
      confirmedPassword: hasedPassword,
      phone,
      address,
      isMfaActive: false,
    });

    const user = await newUser.save();
    await NotificationModel.create({
      message: `📁New user "${user.fullName}" added`,
      type: "success",
      createdBy: req.user?._id || null,
      relatedModel: "userByAdmin",
      relatedId: user._id,
    });
    res
      .status(201)
      .json({ success: true, message: "User Registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate email or unique field
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};

export const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res
        .status(400)
        .json({ message: info?.message || "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, name: user.fullName },
      "CLIENT_SECRET_KEY",
      { expiresIn: "1h" }
    );
    //console.log("token :", token);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    // console.log("JWT token sent in cookie:", token);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  })(req, res, next);
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token").json({
      Success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

export const authStatus = async (req, res) => {
  //console.log(req.cookie.token)

  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("Check auth token", token);
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    // verify token
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    console.log("decoded token ", decoded);
    res.status(200).json({ success: true, user: decoded });
  } catch (error) {
    //console.error("Auth check failed:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export const getAlluser = async (req, res) => {
  try {
    const getAllUser = await userByAdmin.find(
      {},
      {
        fullName: 1,
        role: 1,
        email: 1,
        phone: 1,
        address: 1,
      }
    );
    getAllUser
      ? res.status(200).json({ User: getAllUser })
      : res.status(404).json({ Message: "no User found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllUserById = async (req, res) => {
  try {
    const getAllUser = await userByAdmin.findById(req.params.id, {
      fullName: 1,
      role: 1,
      email: 1,
      phone: 1,
      address: 1,
    });
    getAllUser
      ? res.status(200).json({ User: getAllUser })
      : res.status(404).json({ Message: "no User found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateUser = await userByAdmin.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updateUser) {
      res.status(200).json({ success: "User data updated", User: updateUser });
    }
    res.status(404).json("User not found");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deleteUser = await userByAdmin.findByIdAndDelete(req.params.id);
    if (!deleteUser) {
      res.status(404).json("User not found");
    }

    res.status(200).json({ success: "User deleted", User: deleteUser });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userByAdmin.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    // generate token
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + (parseInt(process.env.TOKEN_EXPIRY_MIN) || 10) * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const html = `
      <h3>Password Reset Request</h3>
      <p>Hello ${user.fullName || ""},</p>
      <p>You requested a password reset. Click the link below to set a new password. This link will expire in ${process.env.TOKEN_EXPIRY_MIN || 10} minutes.</p>
      <a href="${resetURL}">Reset Password</a>
      <p>If you didn't request this, ignore this email.</p>
    `;

    await sendEmail({ to: user.email, subject: "Reset your password", html });

    return res.status(200).json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ success: false, message: "Error sending reset link" });
  }
};

// RESET PASSWORD - verify token and set new password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password is required" });

    const user = await userByAdmin.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(password, 10);
    user.confirmedPassword = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Optionally: send confirmation email
    const html = `<p>Your password has been updated. If you did not perform this action, please contact support.</p>`;
    await sendEmail({ to: user.email, subject: "Your password was changed", html });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ success: false, message: "Could not reset password" });
  }
};

