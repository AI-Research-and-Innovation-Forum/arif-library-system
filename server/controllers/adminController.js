import Book from "../models/book.js";
import Issue from "../models/issue.js";
import User from "../models/user.js";

export const addBookController = async (req, res) => {
  const { title, author, category, isbn, copiesAvailable } = req.body;

  if (!title || !author || !isbn) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const book = new Book({
    title,
    author,
    category,
    isbn,
    copiesAvailable: copiesAvailable || 1,
    image: imageUrl,
  });

  await book.save();
  res.status(201).json({ message: "Book added successfully", book });
};

export const deleteBookController = async (req, res) => {
  const { bookId } = req.params;
  const deleted = await Book.findByIdAndDelete(bookId);

  if (!deleted) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json({ message: "Book deleted successfully" });
};

export const updateBookCopiesController = async (req, res) => {
  const { bookId } = req.params;
  const { copiesAvailable } = req.body;

  try {
    if (!copiesAvailable || copiesAvailable < 0) {
      return res
        .status(400)
        .json({ message: "Copies must be a positive number" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.copiesAvailable = copiesAvailable;
    await book.save();

    res.status(200).json({
      message: "Book copies updated successfully",
      book,
    });
  } catch (error) {
    console.error("Error updating book copies:", error);
    res.status(500).json({ message: "Failed to update book copies" });
  }
};

export const issueBookController = async (req, res) => {
  const { bookId, userId } = req.body;

  const book = await Book.findById(bookId);
  const user = await User.findById(userId);

  if (!book || !user) {
    return res.status(404).json({ message: "Book or User not found" });
  }

  const alreadyIssued = await Issue.findOne({
    book: bookId,
    status: { $nin: ["returned", "rejected"] },
  });
  if (alreadyIssued) {
    return res
      .status(400)
      .json({ message: "Book is already issued to someone else" });
  }

  const issue = new Issue({
    book: bookId,
    user: userId,
    issueDate: new Date(),
    status: "issued",
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  });

  await issue.save();
  res.status(201).json({ message: "Book issued successfully", issue });
};

export const returnBookController = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Issue.findById(requestId)
      .populate("book")
      .populate("user", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "returned") {
      return res
        .status(400)
        .json({ message: "Book has already been returned" });
    }

    request.book.copiesAvailable += 1;
    await request.book.save();

    request.status = "returned";
    request.returnDate = new Date();
    await request.save();

    res.status(200).json({
      message: "Book returned successfully",
      request: await request.populate("book", "title author"),
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Failed to return book" });
  }
};

export const deleteRequestController = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Issue.findById(requestId)
      .populate("book")
      .populate("user", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status === "approved" && !request.returnDate) {
      request.book.copiesAvailable += 1;
      await request.book.save();
    }

    await Issue.findByIdAndDelete(requestId);

    res.status(200).json({
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Failed to delete request" });
  }
};

export const getAllIssuedBooksController = async (req, res) => {
  const issues = await Issue.find({}).populate("book").populate("user");
  res.status(200).json({ total: issues.length, data: issues });
};

export const getAdminDashboardStatsController = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();

    const books = await Book.find({});
    const totalCopiesAvailable = books.reduce(
      (sum, book) => sum + book.copiesAvailable,
      0
    );

    const currentlyBorrowed = await Issue.countDocuments({
      status: "approved",
      returnDate: { $exists: false },
    });

    const totalRequests = await Issue.countDocuments();

    const pendingRequests = await Issue.countDocuments({ status: "requested" });

    const approvedRequests = await Issue.countDocuments({ status: "approved" });

    const rejectedRequests = await Issue.countDocuments({ status: "rejected" });

    const issuedBooks = await Issue.countDocuments({ status: "issued" });

    const returnedBooks = await Issue.countDocuments({ status: "returned" });

    res.status(200).json({
      success: true,
      stats: {
        totalBooks,
        totalCopiesAvailable,
        currentlyBorrowed,
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        issuedBooks,
        returnedBooks,
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ total: users.length, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

export const getUserWithIssuesController = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const issues = await Issue.find({ user: userId })
      .populate("book", "title author isbn")
      .sort({ issueDate: -1 });

    // Mark overdue books
    const updatedIssues = await markOverdueBooks(issues);

    res.status(200).json({
      user,
      issues: { total: updatedIssues.length, data: updatedIssues },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user details", error: error.message });
  }
};

export const getAllUsersWithIssuesController = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    const usersWithIssues = await Promise.all(
      users.map(async (user) => {
        const issues = await Issue.find({
          user: user._id,
          status: { $nin: ["returned", "rejected"] },
        }).populate("book", "title author isbn");

        const updatedIssues = await markOverdueBooks(issues);

        return {
          ...user.toObject(),
          activeIssues: updatedIssues.length,
          currentBooks: updatedIssues,
        };
      })
    );

    res.status(200).json({
      total: usersWithIssues.length,
      data: usersWithIssues,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch users with issues",
        error: error.message,
      });
  }
};

export const getAllRequestsController = async (req, res) => {
  try {
    const requests = await Issue.find({})
      .populate("user", "name email")
      .populate("book", "title author isbn image copiesAvailable")
      .sort({ issueDate: -1 });

    res.status(200).json({
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};

export const getPendingRequestsController = async (req, res) => {
  try {
    const requests = await Issue.find({ status: "issued" })
      .populate("user", "name email")
      .populate("book", "title author isbn image copiesAvailable")
      .sort({ issueDate: -1 });

    res.status(200).json({
      total: requests.length,
      data: requests,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch pending requests",
        error: error.message,
      });
  }
};

export const approveRequestController = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Issue.findById(requestId)
      .populate("book")
      .populate("user", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "requested") {
      return res
        .status(400)
        .json({ message: "Only requested books can be approved" });
    }

    if (request.book.copiesAvailable <= 0) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing" });
    }

    request.book.copiesAvailable -= 1;
    await request.book.save();

    request.status = "approved";
    request.approvedAt = new Date();
    await request.save();

    res.status(200).json({
      message: "Request approved successfully",
      request: await request.populate("book", "title author"),
    });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Failed to approve request" });
  }
};

export const rejectRequestController = async (req, res) => {
  const { requestId } = req.params;
  const { reason } = req.body;

  try {
    const request = await Issue.findById(requestId)
      .populate("book")
      .populate("user", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "requested") {
      return res
        .status(400)
        .json({ message: "Only requested books can be rejected" });
    }

    request.status = "rejected";
    request.rejectedAt = new Date();
    request.rejectionReason = reason || "Request rejected by administrator";
    await request.save();

    res.status(200).json({
      message: "Request rejected successfully",
      request: await request.populate("book", "title author"),
    });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Failed to reject request" });
  }
};

export const returnRequestController = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Issue.findById(requestId)
      .populate("book")
      .populate("user", "name email");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Only approved requests can be returned" });
    }

    if (request.status === "returned") {
      return res
        .status(400)
        .json({ message: "This book has already been returned" });
    }

    request.book.copiesAvailable += 1;
    await request.book.save();

    request.status = "returned";
    request.returnDate = new Date();
    await request.save();

    res.status(200).json({
      message: "Book returned successfully",
      request: await request.populate("book", "title author"),
    });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Failed to return book" });
  }
};

const markOverdueBooks = async (issues) => {
  const now = new Date();
  const updatedIssues = [];

  for (const issue of issues) {
    if (issue.status === "issued" && issue.dueDate < now) {
      const diffTime = now - issue.dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const fine = diffDays > 0 ? diffDays * 5 : 0;

      issue.status = "overdue";
      issue.fine = fine;
      await issue.save();

      updatedIssues.push(issue);
    } else {
      updatedIssues.push(issue);
    }
  }

  return updatedIssues;
};
