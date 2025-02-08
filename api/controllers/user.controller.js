import express from 'express';
import cloudinary from '../utilis/Cloudinary.js';
import { errorHandler } from '../utilis/errorHandler.js';
import User from '../models/user.model.js';

const router = express.Router();

// ✅ Test API
export const test = (req, res) => {
    res.json({ message: 'API GET successful' });
};

// ✅ Upload Image Function
export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        res.status(200).json({
            success: true,
            message: "Image Uploaded Successfully!",
            data: result
        });

    } catch (err) {
        console.error(err);
        next(err)
    }
};


export const updateUser = async (req, res, next) => {
    // console.log(req.user);
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Invalid user not able to update the user details'))
    }

    if (req.body.username === '') {
        return next(errorHandler(403, 'Username must be filled or entered '))
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(403, 'Enter username must be small letters'))
    }

    const updatedFields = {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
    }

    if (req.body.password) {
        if (req.body.password < 6) {
            return next(errorHandler(403, 'Pasword should be greter than 6'))
        } else {
            updatedFields.password = req.body.password
        }
    }


    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: updatedFields,
        }, { new: true });
        const { password, ...rest } = updatedUser._doc;
        return res.status(200).json({
            status: 200,
            msg: 'User Updated Successfully',
            data: rest
        })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.userId) {
            return next(errorHandler(403, 'You Dont have access to delete'))
        }
        const response = await User.findByIdAndDelete(req.params.userId);
        return res.status(200).json({
            status: 200,
            msg: 'User Deleted Successfully',
        })
    } catch (error) {
        next(error)
    }
};

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({
            status: 200,
            success: true,
            message: 'User Signed Out Successfully!'
        })

    } catch (error) {
        next(error)
    }
};

export const getAllUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, 'Not Authorized'))
    }

    try {
        const startIndex = parseInt(req.query.startIndex);
        const limit = parseInt(req.query.limit) || 9;
        const sort = req.query.order === 'asc' ? 1 : -1

        const usersList = await User.find()
            .limit(limit)
            .skip(startIndex)
            .sort({ createdAt: sort })

        const users = usersList.map((user) => {
            const { password, ...rest } = user._doc
            return rest
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsersList = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            users,
            totalUsers,
            lastMonthUsersList
        })

    } catch (error) {
        next(error)
    }
}


export default router;
