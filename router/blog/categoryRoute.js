import express from "express";
import {
  deleteCategories,
  deleteSubCategories,
  getAllCategories,
  getAllCategoryById,
  getAllSubCategoriesByCategoryId,
  getAllSubCategoryById,
  insertcategory,
  insertSubcategory,
  updateCategories,
  updateSubCategories,
} from "../../controller/blog/categoryController.js";
import { verifyToken } from "../../middleware/verifyToken.js";
import { catRules, validatecat } from "../../middleware/categoryValidation.js";

const router = express.Router();

router.post(
  "/insertcategory",
  verifyToken,
  catRules,
  validatecat,
  insertcategory
);

router.get("/getAllCategories", getAllCategories);

router.get("/getAllCategoryById/:id", getAllCategoryById);

router.put("/updateCategories/:id", catRules, validatecat, updateCategories);

router.delete("/deleteCategories/:id", deleteCategories);

router.post(
  "/insertSubCategory",
  verifyToken,
  catRules,
  validatecat,
  insertSubcategory
);

router.get("/getAllSubCategories/:id", getAllSubCategoriesByCategoryId);

router.get("/getSubCategoryById/:id", getAllSubCategoryById);

router.put(
  "/updateSubCategory/:id",
  catRules,
  validatecat,
  updateSubCategories
);

router.delete("/deleteSubCategory/:id", deleteSubCategories);

export default router;
