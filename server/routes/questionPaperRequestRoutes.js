import express from 'express';
import {
    submitQuestionPaperRequest,
    getAllQuestionPaperRequests,
    getQuestionPaperRequestById,
    getUserQuestionPaperRequests,
    approveQuestionPaperRequest,
    rejectQuestionPaperRequest,
    deleteQuestionPaperRequest,
    getQuestionPaperRequestStats
} from '../controllers/questionPaperRequestController.js';
import { protectUser, protectAdmin } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', protectUser, upload.single('file'), submitQuestionPaperRequest);
router.get('/my-requests', protectUser, getUserQuestionPaperRequests);
router.get('/my-requests/:id', protectUser, getQuestionPaperRequestById);
router.delete('/my-requests/:id', protectUser, deleteQuestionPaperRequest);

router.get('/', protectAdmin, getAllQuestionPaperRequests);
router.get('/stats', protectAdmin, getQuestionPaperRequestStats);
router.get('/:id', protectAdmin, getQuestionPaperRequestById);
router.put('/:id/approve', protectAdmin, approveQuestionPaperRequest);
router.put('/:id/reject', protectAdmin, rejectQuestionPaperRequest);
router.delete('/:id', protectAdmin, deleteQuestionPaperRequest);

export default router; 