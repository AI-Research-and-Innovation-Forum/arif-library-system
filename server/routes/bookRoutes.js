import express from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  deleteBook,
} from "../controllers/bookController.js";

import { protectAdmin, protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectAdmin, addBook);
router.get("/", getAllBooks);
router.get("/:id", protectUser, getBookById);
router.delete("/:id", protectAdmin, deleteBook);

export default router;
