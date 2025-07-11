import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./DB/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import questionPaperRoutes from "./routes/questionPaperRoutes.js";
import questionPaperRequestRoutes from "./routes/questionPaperRequestRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from './helpers/cloudinary.js';

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "https://arif-library-system.onrender.com",
  "https://arif-library-management.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/question-paper-requests", questionPaperRequestRoutes);

app.get("/", (req, res) => {
  res.send("Library Management System API is running!");
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

connectDB().then(() => {
  console.log('Connected to MongoDB Database');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
