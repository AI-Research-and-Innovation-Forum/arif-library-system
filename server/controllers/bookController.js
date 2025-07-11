import Book from "../models/book.js";
import cloudinary from '../helpers/cloudinary.js';

export const addBook = async (req, res) => {
  const { title, author, category, isbn, copiesAvailable } = req.body;

  try {
    const book = await Book.create({
      title,
      author,
      category,
      isbn,
      copiesAvailable,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) res.json(book);
  else res.status(404).json({ message: "Book not found" });
};

export const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (book) {
    if (book.image && book.image.startsWith('http') && book.image.includes('/image/upload/')) {
      try {
        const parts = book.image.split('/image/upload/');
        if (parts.length === 2) {
          const publicId = parts[1].replace(/^v[0-9]+\//, '').replace(/\.[^/.]+$/, '');
          const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        } else {
        }
      } catch (err) {
      }
    } else {
    }
    res.json({ message: "Book deleted" });
  } else res.status(404).json({ message: "Book not found" });
};
