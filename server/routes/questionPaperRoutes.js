import express from 'express';
import {
    getAllQuestionPapers,
    getQuestionPaperById,
    uploadQuestionPaper,
    downloadQuestionPaper,
    updateQuestionPaper,
    deleteQuestionPaper,
    getQuestionPaperStats
} from '../controllers/questionPaperController.js';
import { protectUser, protectAdmin } from '../middlewares/authMiddleware.js';
import getUploadMiddleware from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllQuestionPapers);
router.get('/stats', getQuestionPaperStats);
router.get('/:id', getQuestionPaperById);
router.get('/:id/download', downloadQuestionPaper);

const uploadQuestionPaperMiddleware = getUploadMiddleware('question-papers');
router.post('/', protectUser, uploadQuestionPaperMiddleware.single('file'), (req, res, next) => {
  console.log('ROUTE HIT', req.body, req.file);
  next();
}, uploadQuestionPaper);
router.put('/:id', protectUser, updateQuestionPaper);
router.delete('/:id', protectUser, deleteQuestionPaper);

export default router; 