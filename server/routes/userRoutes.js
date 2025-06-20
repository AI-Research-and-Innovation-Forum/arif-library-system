import express from "express";
import {
  getUserProfile,
  myIssuedBooksController,
} from "../controllers/userController.js";
import { protectUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protectUser, getUserProfile);
router.get("/my-issued-books", protectUser, myIssuedBooksController);

export default router;
