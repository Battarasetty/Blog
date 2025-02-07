import express from 'express';
import { create, getPosts } from '../controllers/post.controller.js';
import { verifyToken } from '../utilis/VerifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', verifyToken, getPosts);

export default router