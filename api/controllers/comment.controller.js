import Comment from "../models/comment.model.js";
import { errorHandler } from "../utilis/errorHandler.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You Are Not Authorized to write the comment'))
        }
        const newComment = new Comment({
            content,
            postId,
            userId
        });
        await newComment.save();
        res.status(200).json({
            status: 200,
            msg: 'Commented Added Successfully',
            newComment
        })
    } catch (error) {
        next(error);
    }
};

export const getComment = async (req, res, next) => {
    try {
        const findComment = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1,
        })
        res.status(200).json({
            status: 200,
            findComment
        })
    } catch (error) {
        next(error)
    }
};

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, 'Comment not found'));
        }

        const userIndex = comment.likes.findIndex((id) => id.toString() === req.user.id.toString());

        if (userIndex === -1) {
            comment.likes.push(req.user.id);
            comment.numberOfLikes += 1;
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();

        res.status(200).json({
            status: 200,
            comment,
            likes: comment.likes,
            numberOfLikes: comment.likes.length
        });
    } catch (error) {
        next(error);
    }
};


export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, 'Not Authorized'))
        }
        if (!req.user.isAdmin && comment.userId !== req.user.id) {
            return next(errorHandler(403, 'Not Authorized'))
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content,
        }, { new: true }
        );
        res.status(200).json({
            status: 200,
            editedComment
        })
    } catch (error) {
        next(error)
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, 'Not found!'))
        }

        if (!req.user.isAdmin || req.user.id !== comment.userId) {
            return next(errorHandler(403, 'Not Authorized!'))
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({
            status: 200,
            msg: 'Comment Deleted Successfully'
        })
    } catch (error) {
        next(error)
    }
}
