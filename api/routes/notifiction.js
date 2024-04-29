const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protectedRoute } = require("../utils/protectedRoute");

// Get
router.get("/get", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePic",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error Get Notifictions" });
  }
});

// Delete All Notifictions
router.delete("/delete-notifictions", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res
      .status(200)
      .json({ message: "All Notifications Deleted Successfully 😍" });
  } catch (error) {
    res.status(500).json({ error: "Error Delete All Notifictions" });
  }
});

// Delete Single  Notifiction
router.delete("/delete-notifiction/:id", protectedRoute, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const noticfiction = await Notification.findById(notificationId);
    !noticfiction &&
      res.status(403).json({ error: "Notifiction Not Found 😥" });

    if (noticfiction.to.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ error: "You Can Delete only Your Notifiction 😥" });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ message: "Notification Deleted Success 😎" });
  } catch (error) {
    res.status(500).json({ error: "Error Delete Single Notifiction" });
  }
});

module.exports = router;
