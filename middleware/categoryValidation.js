import { body, validationResult } from "express-validator";
const catRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 3 })
    .withMessage("Description must be at least 3 characters long"),
];

const validatecat = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

export { catRules, validatecat };
