import Settings from "../../model/blog/settingModel.js";
import NotificationModel from "../../model/blog/NotificationModel.js";

export const insertsetting = async (req, res) => {
  try {
    let { siteTitle } = req.body;

    // If image uploaded
    const bgImage = req.file ? req.file.filename : null;

    const newSetting = new Settings({
      siteTitle,
      bgImage,
    });

    const savedSetting = await newSetting.save();

    // Create notification
    await NotificationModel.create({
      message: bgImage
        ? `📁Background image updated`
        : siteTitle
        ? `📁New title "${siteTitle}" added`
        : `📁Settings updated`,
      type: "success",
      createdBy: req.user?._id || null,
      relatedModel: "Settings",
      relatedId: savedSetting._id,
    });

    return res.status(201).json({
      success: true,
      setting: savedSetting,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getAllSettings = async (req, res) => {
  try {
    const allSettings = await Settings.find(
      {},
      {
        siteTitle: 1,
        bgImage: 1,
      }
    );

    allSettings
      ? res.status(200).json({ setting: allSettings })
      : res.status(404).json({ Message: "nothing found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getAllSettingsById = async (req, res) => {
  try {
    const allSettings = await Settings.findById(req.params.id, {
      siteTitle: 1,
      bgImage: 1,
    });
    allSettings
      ? res.status(200).json({ setting: allSettings })
      : res.status(404).json({ Message: "nothing found" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// export const updatesetting = async (req, res) => {
//   try {
//     let updatedData = { ...req.body };

//     // If new image uploaded, add file name
//     if (req.file) {
//       updatedData.logo = req.file.filename;
//     }

//     const updatesettings = await Settings.findByIdAndUpdate(
//       req.params.id,
//       { $set: updatedData },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (updatesettings) {
//       res.status(200).json({ success: "updated", setting: updatesettings });
//     }
//     res.status(404).json("nothing found");
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };
export const updatesetting = async (req, res) => {
  try {
    let updatedData = {};

    // Only update siteTitle if sent
    if (req.body.siteTitle) {
      updatedData.siteTitle = req.body.siteTitle;
    }

    // If a new file uploaded
    if (req.file) {
      updatedData.bgImage = req.file.filename;
    }

    const updatesettings = await Settings.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatesettings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Updated", setting: updatesettings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteSetting = async (req, res) => {
  try {
    const deletesettings = await Settings.findByIdAndDelete(req.params.id);
    if (!deletesettings) {
      res.status(404).json("nothing found");
    }

    res.status(200).json({ success: "Deleted", setting: deletesettings });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
