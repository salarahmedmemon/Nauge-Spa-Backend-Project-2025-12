import categories from "../../model/blog/categoriesModel.js";
import { SubCategory } from "../../model/blog/categoriesModel.js";
import NotificationModel from "../../model/blog/NotificationModel.js";

export const insertcategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const addcategory = new categories({
      name,
      description,
      current: false,
    });
    const cat = await addcategory.save();

    await NotificationModel.create({
      message: `📁 Category "${cat.name}" created`,
      type: "success",
      createdBy: req.user._id,
      relatedModel: "Categories",
      relatedId: cat._id,
    });
    res.status(201).json({
      Success: "Category Inserted Successfully",
      message: cat,
    });
  } catch (error) {
    res.status(500).json({ error: error.errors.title.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const getAllCategories = await categories.find(
      {},
      { name: 1, description: 1, current: 1 }
    );
    getAllCategories
      ? res.status(200).json({ Categories: getAllCategories })
      : res.status(404).json({ Message: "no category found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllCategoryById = async (req, res) => {
  try {
    const getAllCategories = await categories.findById(req.params.id, {
      name: 1,
      description: 1,
      current: 1,
    });
    getAllCategories
      ? res.status(200).json({ Categories: getAllCategories })
      : res.status(404).json({ Message: "no category found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateCategories = async (req, res) => {
  try {
    const updateCategory = await categories.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updateCategory) {
      res
        .status(200)
        .json({ success: "Category updated", Category: updateCategory });
    }
    res.status(404).json("Category not found");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteCategories = async (req, res) => {
  try {
    const deleteCategory = await categories.findByIdAndDelete(req.params.id);
    if (!deleteCategory) {
      res.status(404).json("Category not found");
    }

    res
      .status(200)
      .json({ success: "Category deleted", Category: deleteCategory });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// sub category controller logics

export const insertSubcategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const addSubCategroy = new SubCategory({
      name,
      description,
      category,
    });

   const sub= await addSubCategroy.save();

    await NotificationModel.create({
      message: `📁 SubCategory "${sub.name}" created`,
      type: "success",
      createdBy: req.user._id,
      relatedModel: "SubCategory",
      relatedId: sub._id,
    });
    res.status(200).json({
      Success: "Sub-Category Inserted Successfully",
      message: addSubCategroy,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllSubCategoriesByCategoryId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID before querying
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const getAllSubCategories = await SubCategory.find(
      { category: req.params.id },
      { name: 1, description: 1, category: 1 }
    );

    getAllSubCategories
      ? res.status(200).json({ Categories: getAllSubCategories })
      : res.status(404).json({ Message: "no Sub-Category found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllSubCategoryById = async (req, res) => {
  try {
    const getAllSubCategories = await SubCategory.findById(req.params.id, {
      name: 1,
      description: 1,
      category: 1,
    });
    getAllSubCategories
      ? res.status(200).json({ Categories: getAllSubCategories })
      : res.status(404).json({ Message: "no category found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateSubCategories = async (req, res) => {
  try {
    const updateCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    if (updateCategory) {
      res
        .status(200)
        .json({ success: "Category updated", Category: updateCategory });
    }
    res.status(404).json("Category not found");
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteSubCategories = async (req, res) => {
  try {
    const deleteCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deleteCategory) {
      res.status(404).json("Category not found");
    }

    res
      .status(200)
      .json({ success: "Category deleted", Category: deleteCategory });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
