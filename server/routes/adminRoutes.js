import express from "express";
import { protectAdmin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  addBookController,
  deleteBookController,
  updateBookCopiesController,
  issueBookController,
  returnBookController,
  getAllIssuedBooksController,
  getAdminDashboardStatsController,
  getAllUsersController,
  getUserWithIssuesController,
  getAllUsersWithIssuesController,
  getAllRequestsController,
  getPendingRequestsController,
  approveRequestController,
  rejectRequestController,
  returnRequestController,
  deleteRequestController,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-book", protectAdmin, upload.single('image'), addBookController);
router.delete("/delete-book/:bookId", protectAdmin, deleteBookController);
router.put("/update-book-copies/:bookId", protectAdmin, updateBookCopiesController);
router.post("/issue-book", protectAdmin, issueBookController);
router.post("/return-book", protectAdmin, returnBookController);
router.get("/issued-books", protectAdmin, getAllIssuedBooksController);
router.get("/dashboard-stats", protectAdmin, getAdminDashboardStatsController);

// User Management Routes
router.get("/users", protectAdmin, getAllUsersController);
router.get("/users/:userId", protectAdmin, getUserWithIssuesController);
router.get("/users-with-issues", protectAdmin, getAllUsersWithIssuesController);

// Request Management Routes
router.get("/requests", protectAdmin, getAllRequestsController);
router.get("/requests/pending", protectAdmin, getPendingRequestsController);
router.put("/requests/:requestId/approve", protectAdmin, approveRequestController);
router.put("/requests/:requestId/reject", protectAdmin, rejectRequestController);
router.put("/requests/:requestId/return", protectAdmin, returnRequestController);
router.delete("/requests/:requestId", protectAdmin, deleteRequestController);

export default router;
