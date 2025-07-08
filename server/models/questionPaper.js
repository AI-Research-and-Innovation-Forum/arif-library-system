import mongoose from "mongoose";

const questionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    semester: {
      type: String,
      required: true,
      enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
    },
    course: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    description: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const QuestionPaper = mongoose.model("QuestionPaper", questionPaperSchema);
export default QuestionPaper; 