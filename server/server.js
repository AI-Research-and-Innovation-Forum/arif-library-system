import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.js";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";
import path from "path";
import { fileURLToPath } from "url";

import { errorHandler } from "./helpers/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import questionPaperRoutes from "./routes/questionPaperRoutes.js";
import questionPaperRequestRoutes from "./routes/questionPaperRequestRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/question-papers", questionPaperRoutes);
app.use("/api/question-paper-requests", questionPaperRequestRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgMagenta);
});
