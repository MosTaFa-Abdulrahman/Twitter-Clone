const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    profilePic: { type: String, default: "" },
    coverPic: { type: String, default: "" },
    bio: { type: String, default: "" },
    link: { type: String, default: "" },
    followers: { type: [String], default: [] },
    followings: { type: [String], default: [] },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
