import Book from "../models/book.js";
import Issue from "../models/issue.js";
import User from "../models/user.js";

export const addBookController = async (req, res) => {
  const { title, author, category, isbn } = req.body;

  if (!title || !author || !isbn) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const book = new Book({ title, author, category, isbn });
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

export const issueBookController = async (req, res) => {
  const { bookId, userId } = req.body;

  const book = await Book.findById(bookId);
  const user = await User.findById(userId);

  if (!book || !user) {
    return res.status(404).json({ message: "Book or User not found" });
  }

  const alreadyIssued = await Issue.findOne({ book: bookId, returned: false });
  if (alreadyIssued) {
    return res
      .status(400)
      .json({ message: "Book is already issued to someone else" });
  }

  const issue = new Issue({
    book: bookId,
    user: userId,
    issuedAt: new Date(),
    returned: false,
  });

  await issue.save();
  res.status(201).json({ message: "Book issued successfully", issue });
};

export const returnBookController = async (req, res) => {
  const { issueId } = req.body;

  const issue = await Issue.findById(issueId);
  if (!issue || issue.returned) {
    return res
      .status(404)
      .json({ message: "Issue record not found or already returned" });
  }

  issue.returned = true;
  issue.returnedAt = new Date();
  await issue.save();

  res.status(200).json({ message: "Book returned successfully", issue });
};

export const getAllIssuedBooksController = async (req, res) => {
  const issues = await Issue.find({}).populate("book").populate("user");
  res.status(200).json({ total: issues.length, data: issues });
};
