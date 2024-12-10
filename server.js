import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

//database
connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/tag", tagRoutes);
app.use("/api/v1/post", postRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to BlueSky</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on ${PORT}`.bgRed.white
  );
});
