import { body, validationResult } from "express-validator";

const BlogInsertionRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 3 })
    .withMessage("Content must be at least 3 characters long"),

  body("authorId").notEmpty().withMessage("Author is required"),

  body("categoryId").notEmpty().withMessage("Category is required"),

  body("subCategoryId").notEmpty().withMessage("Subcategory is required"),

  body("tags")
    .notEmpty()
    .withMessage("Tags are required"),
   

  body("featured")
    .notEmpty()
    .withMessage("Featured is required")

  // blogImage is handled by multer, so check in controller instead
];

const validateBlog = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};

export { BlogInsertionRules, validateBlog };
