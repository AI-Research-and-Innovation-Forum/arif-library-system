import express from "express";
import {
  issueBook,
  returnBook,
  getUserIssuedBooks,
} from "../controllers/issueController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/issue", protect, issueBook);
router.post("/return", protect, returnBook);
router.get("/mybooks", protect, getUserIssuedBooks);

export default router;
