import express from 'express';
import { create, deletePosts, getPosts, updatepost } from '../controllers/post.controller.js';
import { verifyToken } from '../utilis/VerifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', verifyToken, getPosts);
router.delete('/deleteposts/:postId/:userId', verifyToken, deletePosts);
router.put('/updatepost/:userId/:postId', verifyToken, updatepost);

export default router