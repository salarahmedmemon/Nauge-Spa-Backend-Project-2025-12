import newsletter from "./../model/NewsLetterModel.js";
import NotificationModel from "../model/blog/NotificationModel.js";
import sendEmail from "../router/utils/sendEmail.js";

export const insertuser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const User = await newsletter({
      name,
      email,
    });
    const newletterUser = await User.save();
    await NotificationModel.create({
      message: `📁New user "${newletterUser.name}" added by news letter`,
      type: "success",
      createdBy: req.user?._id || null,
      relatedModel: "news_latter",
      relatedId: newletterUser._id,
    });
    res.status(201).json({ Success: true, user: newletterUser });
  } catch (error) {
    // Duplicate email or unique field
    if (error.code === 11000) {
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

export const fetchAllUser = async (req, res) => {
  try {
    const fetchedUser = await newsletter.find({}, { name: 1, email: 1 });

    if (!fetchedUser || fetchedUser.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ user: fetchedUser });
  } catch (error) {
    console.error("Error fetching newsletter users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const sendingEmail = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    const user = await newsletter.find({ email: { $in: email } });
    if (user.length === 0)
      return res.status(404).json({ Message: "no User found" });
    for (const items of user) {
      await sendEmail({ to: items.email, subject: subject, text: message });
    }

    res.json({ msg: "mail send successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
