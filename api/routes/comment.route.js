import express from 'express';
import { verifyToken } from '../utilis/VerifyUser.js';
import { createComment, getComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment)
router.get('/getComment/:postId', getComment)

export default router;