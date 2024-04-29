const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Notification = require("../models/Notification");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const { protectedRoute } = require("../utils/protectedRoute");

// Get By (Username)
router.get("/find/:username", async (req, res) => {
  try {
    const getUser = await User.findOne({ username: req.params.username });
    if (getUser) return res.status(200).json(getUser);
    else res.status(400).json({ error: "User Not Found 😣" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put("/update/:id", protectedRoute, async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profilePic, coverPic } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profilePic) {
      if (user.profilePic) {
        // https://res.cloudinary.com/dgoyrssub/image/upload/v1714182206/lbi5atplmseum6x05ktt.jpg
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    if (coverPic) {
      if (user.coverPic) {
        await cloudinary.uploader.destroy(
          user.coverPic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverPic);
      coverPic = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profilePic = profilePic || user.profilePic;
    user.coverPic = coverPic || user.coverPic;

    user = await user.save();

    // password should be null in response
    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/UnFollow
router.post("/follow/:id", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.user._id);
    const anotherUser = await User.findById(id);

    if (id === req.user._d) {
      return res
        .status(400)
        .json({ error: "You cannot Follow/UnFollow Yourself 😉" });
    }

    if (!currentUser || !anotherUser) {
      return res.status(400).json({ error: "User not found 😣" });
    }

    const isFollowing = currentUser.followings.includes(id);
    if (isFollowing) {
      // UnFollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { followings: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User UnFollowed Successfully 😎" });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { followings: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: anotherUser._id,
      });

      await newNotification.save();

      res.status(200).json({ message: "User Followed Successfully 💘" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Suggested Users ((Focus 🧠))
router.get("/suggested/get", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    // Get the authenticated user's followings
    const user = await User.findById(userId);
    const followings = user.followings;

    // Get users who are not already followed by the authenticated user
    const suggestedUsers = await User.find({
      _id: { $nin: [...followings, userId] }, // Exclude authenticated user and users already followed
    }).limit(10); // Limit to 10 suggested users

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json("Error Get Suggested Users !😥");
  }
});

module.exports = router;
