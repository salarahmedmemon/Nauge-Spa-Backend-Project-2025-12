export const isAuthenticated = (req, res, next) => {
  // passport attaches user info to req.user after login
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ success: false, message: "Not authenticated" });
};
