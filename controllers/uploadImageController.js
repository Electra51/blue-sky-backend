import express from "express";

const router = express.Router();
import multer from "multer";
import path from "path";

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
}).single("image");

export const uploadImageController = async (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        res.status(400).json({ message: err });
      } else {
        console.log(req.file);
        const imageUrl = `${
          process.env.BASE_URL || "http://localhost:8080"
        }${req.file.path.replace("public", "")}`;
        res.status(200).json({ url: imageUrl });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
