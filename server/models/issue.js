import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: Date,
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "issued", "returned", "overdue"],
      default: "requested",
    },
    approvedAt: Date,
    rejectedAt: Date,
    rejectionReason: String,
    physicalHandling: {
      issued: {
        type: Boolean,
        default: false,
      },
      issuedAt: Date,
      issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      returned: {
        type: Boolean,
        default: false,
      },
      returnedAt: Date,
      returnedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    dueDate: {
      type: Date,
      required: true,
    },
    fine: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
