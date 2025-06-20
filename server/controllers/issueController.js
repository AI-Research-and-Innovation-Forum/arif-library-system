import Issue from "../models/issue.js";
import Book from "../models/book.js";

export const issueBook = async (req, res) => {
  const { bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    if (!book || book.copiesAvailable <= 0)
      return res.status(400).json({ message: "Book not available" });

    const issue = await Issue.create({
      user: req.user._id,
      book: bookId,
      status: "issued",
    });

    book.copiesAvailable -= 1;
    await book.save();

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const returnBook = async (req, res) => {
  const { issueId } = req.body;

  try {
    const issue = await Issue.findById(issueId).populate("book");
    if (!issue || issue.status === "returned")
      return res.status(400).json({ message: "Invalid issue record" });

    issue.status = "returned";
    issue.returnDate = new Date();
    await issue.save();

    issue.book.copiesAvailable += 1;
    await issue.book.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserIssuedBooks = async (req, res) => {
  const issues = await Issue.find({ user: req.user._id }).populate("book");
  res.json(issues);
};
