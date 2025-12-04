import { body, validationResult } from "express-validator";

const userRegistrationRules = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("confirmedPassword")
    .trim()
    .notEmpty()
    .withMessage("Password should be alteast 6 characters long")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phone")
    .notEmpty()
    .withMessage("Contact number is required")
    .isLength({ min: 11, max: 11 })
    .withMessage("Phone number must be 11 digit long "),

  body("address").notEmpty().withMessage("Address is required"),
];

const userLoginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("confirmedPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

export { userRegistrationRules, userLoginRules, validateUser };
