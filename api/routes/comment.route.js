import express from 'express';
import { verifyToken } from '../utilis/VerifyUser.js';
import { createComment, deleteComment, editComment, getComment, likeComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment)
router.get('/getComment/:postId', getComment)
router.put('/likecomment/:commentId', verifyToken, likeComment)
router.put('/editcomment/:commentId', verifyToken, editComment)
router.delete('/deletecomment/:commentId', verifyToken, deleteComment)

export default router;