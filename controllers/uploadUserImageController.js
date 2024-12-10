import express from "express";
import multer from "multer";
import path from "path";
import userModel from "../models/userModel.js";

const router = express.Router();

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Set up multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images only!");
    }
  },
}).single("profileImage"); // Update field name here to "profileImage"

// Controller function
export const uploadUserImageController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { email } = req.params;
      const { nickname } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find the user by email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update user fields
      if (nickname) user.nickname = nickname;
      if (req.file) {
        const imageUrl = `${
          process.env.BASE_URL || "http://localhost:8080"
        }${req.file.path.replace("public", "")}`;
        user.profileImage = imageUrl;
      }

      // Save the updated user data
      await user.save();

      res.status(200).json({
        success: true,
        message: "User profile updated successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  });
};
