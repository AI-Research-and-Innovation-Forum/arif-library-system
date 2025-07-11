import QuestionPaper from "../models/questionPaper.js";
import { errorHandler } from "../helpers/errorHandler.js";
import fs from "fs";
import path from "path";
import cloudinary from '../helpers/cloudinary.js';

export const getAllQuestionPapers = async (req, res) => {
  try {
    const { subject, year, semester, course, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (subject) query.subject = { $regex: subject, $options: "i" };
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (course) query.course = { $regex: course, $options: "i" };

    const skip = (page - 1) * limit;

    const questionPapers = await QuestionPaper.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QuestionPaper.countDocuments(query);

    res.status(200).json({
      success: true,
      data: questionPapers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getQuestionPaperById = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    res.status(200).json({
      success: true,
      data: questionPaper,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const uploadQuestionPaper = async (req, res) => {
  try {
    const { title, subject, year, semester, course, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    let filePath, fileSize, filePublicId;

    if (req.file.mimetype === 'application/pdf') {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'question-papers',
        resource_type: 'raw',
        type: 'upload',
        use_filename: true,
        unique_filename: false,
      });
      filePath = uploadResult.secure_url;
      fileSize = req.file.size;
      filePublicId = uploadResult.public_id;
      fs.unlinkSync(req.file.path);
    } else {
      filePath = req.file.path;
      fileSize = req.file.size;
      filePublicId = req.file.filename;
    }

    const questionPaper = new QuestionPaper({
      title,
      subject,
      year: parseInt(year),
      semester,
      course,
      description,
      filePath,
      fileSize,
      filePublicId,
      uploadedBy: req.user.id,
    });

    await questionPaper.save();

    res.status(201).json({
      success: true,
      message: "Question paper uploaded successfully",
      data: questionPaper,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const downloadQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    if (!questionPaper.isActive) {
      return res.status(400).json({
        success: false,
        message: "Question paper is not available for download",
      });
    }

    if (questionPaper.filePath && questionPaper.filePath.startsWith('http')) {
      const url = questionPaper.filePath;
      questionPaper.downloads += 1;
      await questionPaper.save();
      return res.redirect(url);
    }

    if (!fs.existsSync(questionPaper.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    questionPaper.downloads += 1;
    await questionPaper.save();

    res.download(questionPaper.filePath);
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateQuestionPaper = async (req, res) => {
  try {
    const { title, subject, year, semester, course, description } = req.body;

    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      questionPaper.uploadedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this question paper",
      });
    }

    const updatedQuestionPaper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subject,
        year: parseInt(year),
        semester,
        course,
        description,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Question paper updated successfully",
      data: updatedQuestionPaper,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteQuestionPaper = async (req, res) => {
  try {
    const questionPaper = await QuestionPaper.findById(req.params.id);

    if (!questionPaper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      questionPaper.uploadedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this question paper",
      });
    }

    if (questionPaper.filePublicId) {
      try {
        // For PDFs (raw) and images (image)
        const resourceType = questionPaper.filePath.endsWith('.pdf') ? 'raw' : 'image';
        await cloudinary.uploader.destroy(questionPaper.filePublicId, { resource_type: resourceType });
      } catch (err) {
        console.error('Error deleting from Cloudinary:', err);
      }
    }

    if (fs.existsSync(questionPaper.filePath)) {
      fs.unlinkSync(questionPaper.filePath);
    }

    await QuestionPaper.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Question paper deleted successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getQuestionPaperStats = async (req, res) => {
  try {
    const stats = await QuestionPaper.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalPapers: { $sum: 1 },
          totalDownloads: { $sum: "$downloads" },
          averageDownloads: { $avg: "$downloads" },
        },
      },
    ]);

    const subjectStats = await QuestionPaper.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 },
          downloads: { $sum: "$downloads" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {
          totalPapers: 0,
          totalDownloads: 0,
          averageDownloads: 0,
        },
        subjects: subjectStats,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
