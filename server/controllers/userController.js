import Issue from "../models/issue.js";

export const getUserProfile = async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

export const myIssuedBooksController = async (req, res) => {
  try {
    const issuedBooks = await Issue.find({ user: req.user._id })
      .populate("book", "title author isbn")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      count: issuedBooks.length,
      data: issuedBooks,
    });
  } catch (error) {
    console.error("Error fetching issued books:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch issued books",
    });
  }
};
