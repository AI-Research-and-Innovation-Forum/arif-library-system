import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import {
  addBookController,
  deleteBookController,
  issueBookController,
  returnBookController,
  getAllIssuedBooksController,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-book", protectAdmin, addBookController);
router.delete("/delete-book/:bookId", protectAdmin, deleteBookController);
router.post("/issue-book", protectAdmin, issueBookController);
router.post("/return-book", protectAdmin, returnBookController);
router.get("/issued-books", protectAdmin, getAllIssuedBooksController);

export default router;
