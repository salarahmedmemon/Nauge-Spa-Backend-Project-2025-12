import blog from "../../model/blog/blogModel.js";
import NotificationModel from "../../model/blog/NotificationModel.js";

export const insertBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      authorId,
      categoryId,
      subCategoryId,
      tags,
      featured,
    } = req.body;

    const isFeatured =
      featured === true || featured === "true" || featured === '"true"'
        ? true
        : false;
    if (!req.file) {
      return res.status(400).json({ error: "Blog image is required" });
    }
    const blogImage = req.file ? req.file.filename : null;
    const addBlog = new blog({
      title,
      content,
      authorId,
      categoryId,
      subCategoryId,
      tags: Array.isArray(tags) ? tags : [tags],
      featured: isFeatured,
      blogImage,
    });
    const savedblog = await addBlog.save();

    await NotificationModel.create({
      message: `🆕 New blog added: "${savedblog.title}"`,
      type: "success",
      createdBy: req.user._id,
      relatedModel: "blogs",
      relatedId: savedblog._id,
    });

    res
      .status(201)
      .json({ Success: "Blog Inserted Successfully", message: savedblog });
  } catch (error) {
    console.error("Insert Blog Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const getAllBlogs = await blog
      .find(
        {},
        {
          title: 1,
          content: 1,
          authorId: 1,
          categoryId: 1,
          subCategoryId: 1,
          tags: 1,
          featured: 1,
          blogImage: 1,
          createdAt: 1,
          updatedAt: 1,
        }
      )
      .populate("categoryId", "name")
      .populate("subCategoryId", "name")
      .populate("authorId", "role");
    getAllBlogs
      ? res.status(200).json({ Blogs: getAllBlogs })
      : res.status(404).json({ Message: "no blog found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllBlogsById = async (req, res) => {
  try {
    const getAllBlogs = await blog.findById(req.params.id, {
      title: 1,
      content: 1,
      authorId: 1,
      categoryId: 1,
      subCategoryId: 1,
      tags: 1,
      featured: 1,
      blogImage: 1,
      createdAt: 1,
      updatedAt: 1,
    });
    getAllBlogs
      ? res.status(200).json({ Blogs: getAllBlogs })
      : res.status(404).json({ Message: "no blog found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateBlog = async (req, res) => {
  try {
    //console.log("🧾 Incoming Update Blog Request:");
    //console.log("req.body:", req.body);
    //console.log("req.file:", req.file);
    const {
      title,
      content,
      authorId,
      categoryId,
      subCategoryId,
      tags,
      featured,
    } = req.body;

    const isFeatured =
      featured === true || featured === "true" || featured === '"true"'
        ? true
        : false;

    const blogImage = req.file ? req.file.filename : req.body.blogImage;

    // ✅ Fix tags handling - COMPLETELY
    let tagsArray = [];

    if (typeof tags === "string") {
      try {
        // Pehle check karo agar JSON string hai
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          tagsArray = parsed;
        } else {
          // Agar JSON string nahi hai to comma separated samjho
          tagsArray = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        }
      } catch (error) {
        // JSON parse fail ho to comma separated samjho
        tagsArray = tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);
      }
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }

    // ✅ Agar tagsArray empty hai to error return karo
    if (tagsArray.length === 0) {
      return res.status(400).json({ error: "At least one tag is required" });
    }

    const updateData = {
      title,
      content,
      authorId,
      categoryId,
      subCategoryId,
      tags: tagsArray,
      featured: isFeatured,
      blogImage,
    };

    const updatedBlog = await blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const deleteblog = await blog.findByIdAndDelete(req.params.id);
    if (!deleteblog) {
      res.status(404).json("Blog not found");
    }

    res.status(200).json({ success: "Blog deleted", blog: deleteBlog });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
