import Notification from "../../model/blog/NotificationModel.js";

export const addNotification = async (req, res) => {
  try {
    const { message, type, createdBy, relatedModel, relatedId } = req.body;

    const note = await Notification.create({
      message,
      type,
      createdBy,
      relatedModel,
      relatedId,
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications...");

    const notes = await Notification.find(
      {},
      { message: 1, type: 1, createdBy: 1, relatedModel: 1, relatedId: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "fullName role")
      .populate("relatedId", "title name");

    console.log("Fetched notes:", notes);

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Error in getRecentNotifications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
