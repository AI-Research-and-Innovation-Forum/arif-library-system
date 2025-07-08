import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/db.js";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import "express-async-errors";

import { errorHandler } from "./helpers/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

<<<<<<< Updated upstream
app.use(cors());
=======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://arif-library-system.onrender.com"
  ],
  credentials: true
}));
>>>>>>> Stashed changes
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgMagenta);
});
