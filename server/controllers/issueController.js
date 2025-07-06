import Issue from "../models/issue.js";
import Book from "../models/book.js";
import { calculateDueDate, calculateFine } from "../helpers/tokenGenerator.js";

export const requestBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.copiesAvailable <= 0) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing" });
    }

    const existingIssue = await Issue.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ["requested", "approved", "issued"] },
    });

    if (existingIssue) {
      return res
        .status(400)
        .json({ message: "You already have a request for this book" });
    }

    const dueDate = calculateDueDate(14);

    const issue = new Issue({
      user: req.user._id,
      book: bookId,
      issueDate: new Date(),
      status: "requested",
      dueDate,
    });

    await issue.save();

    res.status(201).json({
      message:
        "Book request submitted successfully. Please wait for admin approval.",
      issue: await issue.populate("book", "title author"),
    });
  } catch (err) {
    console.error("Error creating book request:", err);
    res
      .status(500)
      .json({ message: "Failed to submit book request. Please try again." });
  }
};

export const approveBookRequest = async (req, res) => {
  const { issueId } = req.body;

  try {
    const issue = await Issue.findById(issueId).populate("book user");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status !== "requested") {
      return res
        .status(400)
        .json({ message: "This request cannot be approved" });
    }

    if (issue.book.copiesAvailable <= 0) {
      return res.status(400).json({ message: "Book is no longer available" });
    }

    issue.status = "approved";
    issue.approvedAt = new Date();
    await issue.save();

    issue.book.copiesAvailable -= 1;
    await issue.book.save();

    res.json({
      message: "Book request approved successfully",
      issue,
    });
  } catch (err) {
    console.error("Error approving book request:", err);
    res
      .status(500)
      .json({ message: "Failed to approve book request. Please try again." });
  }
};

export const rejectBookRequest = async (req, res) => {
  const { issueId, rejectionReason } = req.body;

  try {
    const issue = await Issue.findById(issueId).populate("book user");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status !== "requested") {
      return res
        .status(400)
        .json({ message: "This request cannot be rejected" });
    }

    issue.status = "rejected";
    issue.rejectedAt = new Date();
    issue.rejectionReason = rejectionReason || "Request rejected by admin";
    await issue.save();

    res.json({
      message: "Book request rejected successfully",
      issue,
    });
  } catch (err) {
    console.error("Error rejecting book request:", err);
    res
      .status(500)
      .json({ message: "Failed to reject book request. Please try again." });
  }
};

export const issueBookDirectly = async (req, res) => {
  const { issueId } = req.body;

  try {
    const issue = await Issue.findById(issueId).populate("book user");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status !== "approved") {
      return res
        .status(400)
        .json({ message: "This request is not approved for issue" });
    }

    if (issue.physicalHandling.issued) {
      return res.status(400).json({ message: "Book has already been issued" });
    }

    issue.status = "issued";
    issue.physicalHandling.issued = true;
    issue.physicalHandling.issuedAt = new Date();
    issue.physicalHandling.issuedBy = req.user._id;
    await issue.save();

    res.json({
      message: "Book issued successfully",
      issue,
      bookDetails: {
        title: issue.book.title,
        author: issue.book.author,
        userName: issue.user.name,
        dueDate: issue.dueDate,
      },
    });
  } catch (err) {
    console.error("Error issuing book directly:", err);
    res
      .status(500)
      .json({ message: "Failed to issue book. Please try again." });
  }
};

export const returnBookDirectly = async (req, res) => {
  const { issueId } = req.body;

  try {
    const issue = await Issue.findById(issueId).populate("book user");
    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status !== "issued") {
      return res
        .status(400)
        .json({ message: "This book is not currently issued" });
    }

    if (issue.physicalHandling.returned) {
      return res
        .status(400)
        .json({ message: "Book has already been returned" });
    }

    const fine = calculateFine(issue.dueDate);

    issue.status = "returned";
    issue.returnDate = new Date();
    issue.physicalHandling.returned = true;
    issue.physicalHandling.returnedAt = new Date();
    issue.physicalHandling.returnedBy = req.user._id;
    issue.fine = fine;
    await issue.save();

    issue.book.copiesAvailable += 1;
    await issue.book.save();

    res.json({
      message: "Book returned successfully",
      issue,
      fine,
      bookDetails: {
        title: issue.book.title,
        author: issue.book.author,
        userName: issue.user.name,
        dueDate: issue.dueDate,
        returnedAt: issue.returnDate,
      },
    });
  } catch (err) {
    console.error("Error returning book directly:", err);
    res
      .status(500)
      .json({ message: "Failed to return book. Please try again." });
  }
};

export const getUserBookRequests = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user._id })
      .populate("book", "title author isbn image")
      .sort({ issueDate: -1 });

    res.json(issues);
  } catch (err) {
    console.error("Error fetching user book requests:", err);
    res.status(500).json({ message: "Failed to fetch your book requests" });
  }
};

export const getAllBookRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const issues = await Issue.find(filter)
      .populate("book", "title author isbn image")
      .populate("user", "name email")
      .populate("physicalHandling.issuedBy", "name")
      .populate("physicalHandling.returnedBy", "name")
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error fetching book requests:", err);
    res.status(500).json({ message: "Failed to fetch book requests" });
  }
};

export const getBookRequestStats = async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await Issue.countDocuments();
    const overdueRequests = await Issue.countDocuments({
      status: "issued",
      dueDate: { $lt: new Date() },
    });

    res.json({
      statusBreakdown: stats,
      totalRequests,
      overdueRequests,
    });
  } catch (err) {
    console.error("Error fetching book request stats:", err);
    res.status(500).json({ message: "Failed to fetch statistics" });
  }
};
