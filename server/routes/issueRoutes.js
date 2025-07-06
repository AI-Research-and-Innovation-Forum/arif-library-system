import express from "express";
import {
  requestBook,
  approveBookRequest,
  rejectBookRequest,
  issueBookDirectly,
  returnBookDirectly,
  getUserBookRequests,
  getAllBookRequests,
  getBookRequestStats,
} from "../controllers/issueController.js";
import { protectUser, protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/request", protectUser, requestBook);
router.get("/my-requests", protectUser, getUserBookRequests);

router.post("/approve", protectAdmin, approveBookRequest);
router.post("/reject", protectAdmin, rejectBookRequest);
router.post("/issue-directly", protectAdmin, issueBookDirectly);
router.post("/return-directly", protectAdmin, returnBookDirectly);
router.get("/all", protectAdmin, getAllBookRequests);
router.get("/stats", protectAdmin, getBookRequestStats);

export default router; 