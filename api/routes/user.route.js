import express from 'express';
import { deleteUser, test, updateUser, uploadImage } from '../controllers/user.controller.js';  // Assuming uploadImage is in the controller
import upload from '../middleware/multer.middleware.js';
import { verifyToken } from '../utilis/VerifyUser.js';

const router = express.Router();

// Test API Route
router.get('/test', test);

// Upload Route with Middleware
router.post('/upload', upload.single('image'), uploadImage); 

// Update user data 
router.put('/update/:userId', verifyToken, updateUser)

// Delete user data 
router.delete('/delete/:userId', verifyToken, deleteUser)

export default router;
