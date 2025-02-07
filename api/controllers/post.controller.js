import { errorHandler } from "../utilis/errorHandler.js"
import Post from '../models/post.model.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Not Authorized'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(403, 'Please fill all the fields'))
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');

    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    })

    try {
        const response = await newPost.save();
        return res.status(200).json({
            success: true,
            status: 200,
            data: response
        })
    } catch (error) {
        next(error)
    }
};


export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const order = req.query.order === 'asc' ? 1 : -1;

        const query = {};
        if (req.query.userId) query.userId = req.query.userId;
        if (req.query.category) query.category = req.query.category;
        if (req.query.slug) query.slug = req.query.slug;
        if (req.query.postId) query._id = req.query.postId;
        if (req.query.searchTerm) {
            query.$or = [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ]
        }
        const posts = await Post.find(query)
            .sort({ updatedAt: order })
            .skip(startIndex)
            .limit(limit)

        const totalPosts = await Post.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            status: 200,
            posts,
            totalPosts,
            lastMonthPosts
        })

    } catch (error) {
        next(error)
    }
}