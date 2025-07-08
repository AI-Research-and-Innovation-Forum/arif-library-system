import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: String,
    category: String,
    isbn: String,
    copiesAvailable: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
