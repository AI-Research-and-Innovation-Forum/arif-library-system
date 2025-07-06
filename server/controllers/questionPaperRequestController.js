import QuestionPaperRequest from "../models/questionPaperRequest.js";
import QuestionPaper from "../models/questionPaper.js";
import { errorHandler } from "../helpers/errorHandler.js";
import fs from "fs";

export const submitQuestionPaperRequest = async (req, res) => {
  try {
    const { title, subject, year, semester, course, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const questionPaperRequest = new QuestionPaperRequest({
      title,
      subject,
      year: parseInt(year),
      semester,
      course,
      description,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    await questionPaperRequest.save();

    res.status(201).json({
      success: true,
      message:
        "Question paper request submitted successfully. Waiting for admin approval.",
      data: questionPaperRequest,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllQuestionPaperRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const requests = await QuestionPaperRequest.find(query)
      .populate("uploadedBy", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QuestionPaperRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: requests,
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

export const getQuestionPaperRequestById = async (req, res) => {
  try {
    const request = await QuestionPaperRequest.findById(req.params.id)
      .populate("uploadedBy", "name email")
      .populate("reviewedBy", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Question paper request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getUserQuestionPaperRequests = async (req, res) => {
  try {
    const requests = await QuestionPaperRequest.find({
      uploadedBy: req.user.id,
    })
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const approveQuestionPaperRequest = async (req, res) => {
  try {
    const { feedback } = req.body;

    const request = await QuestionPaperRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Question paper request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    const questionPaper = new QuestionPaper({
      title: request.title,
      subject: request.subject,
      year: request.year,
      semester: request.semester,
      course: request.course,
      description: request.description,
      filePath: request.filePath,
      fileSize: request.fileSize,
      uploadedBy: request.uploadedBy,
    });

    await questionPaper.save();

    request.status = "approved";
    request.adminFeedback = feedback || "Approved by admin";
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Question paper request approved successfully",
      data: {
        request,
        questionPaper,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const rejectQuestionPaperRequest = async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback is required when rejecting a request",
      });
    }

    const request = await QuestionPaperRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Question paper request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    request.status = "rejected";
    request.adminFeedback = feedback;
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();

    await request.save();

    res.status(200).json({
      success: true,
      message: "Question paper request rejected successfully",
      data: request,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteQuestionPaperRequest = async (req, res) => {
  try {
    const request = await QuestionPaperRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Question paper request not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      request.uploadedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this request",
      });
    }

    if (fs.existsSync(request.filePath)) {
      fs.unlinkSync(request.filePath);
    }

    await QuestionPaperRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Question paper request deleted successfully",
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getQuestionPaperRequestStats = async (req, res) => {
  try {
    const stats = await QuestionPaperRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalRequests = await QuestionPaperRequest.countDocuments();
    const pendingRequests = await QuestionPaperRequest.countDocuments({
      status: "pending",
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalRequests,
        pending: pendingRequests,
        byStatus: stats,
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
};
