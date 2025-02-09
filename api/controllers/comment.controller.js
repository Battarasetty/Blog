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
}