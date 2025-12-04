import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // 1️⃣ Get token either from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    // 2️⃣ Verify the token
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");

    // 3️⃣ Attach user info to req.user (so controllers can use req.user._id, req.user.role, etc.)
    req.user = decoded;

    // 4️⃣ Continue to next middleware/controller
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
