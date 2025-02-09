import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Comment from './Comment';

const CommentsSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [comments, setComments] = useState('');
    const [comment, setComment] = useState('');
    // console.log(comment);

    const handleChange = (e) => {
        setComments(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comments.length > 200) {
            return
        }
        try {
            const response = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comments, postId, userId: currentUser.data._id })
            })
            const result = await response.json();
            if (result.status === 200) {
                toast.success(result.msg);
                setComments('');
                setComment([result, ...comment])
            }
        } catch (error) {
            toast.error("something went wrong")
        }
    };

    useEffect(() => {
        const getPostComment = async () => {
            try {
                const response = await fetch(`/api/comment/getComment/${postId}`);
                const result = await response.json();
                if (result.status === 200) {
                    setComment(result.findComment)
                }
            } catch (error) {
                toast.error('something went wrong')
            }
        };

        getPostComment();
    }, [postId]);

    const handleLike = async (commentId) => {
        console.log(commentId);

        if (!currentUser) {
            navigate('/sign-in')
            return
        }

        try {
            const response = await fetch(`/api/comment/likecomment/${commentId}`, {
                method: 'PUT'
            })
            const result = await response.json();
            if (result.status === 200) {
                setComment(prevComments =>
                    prevComments.map(c =>
                        c._id === commentId
                            ? {
                                ...c,
                                likes: result.likes, // Update likes
                                numberOfLikes: result.numberOfLikes,
                            }
                            : c
                    )
                );
            }
        } catch (error) {
            toast.error('something went wrong')
        }
    };

    const handleUpdate = async (comments, editedContent) => {
        setComment(
            comment.map((c) =>
                c._id === comments._id ?
                    { ...c, content: editedContent } : c
            )
        )
    }

    return (
        <div className='max-w-2xl w-full mx-auto py-5'>
            {
                currentUser ? (
                    <div className='flex items-center gap-1 text-sm text-gray-500 my-5'>
                        <p>Signed in as :</p>
                        <img className='w-5 h-5 rounded-full object-cover' src={currentUser.data.profilePicture} alt={currentUser.data.username} />
                        <Link className='text-cyan-600 hover:underline text-xs' to={'/dashboard?tab=profile'}>
                            @{currentUser.data.username}
                        </Link>
                    </div>
                ) : (
                    <div className='text-sm text-teal-500 flex items-center gap-2'>
                        <p>You must need to login to comment</p>
                        <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign in</Link>
                    </div>
                )
            }
            {
                currentUser && (
                    <form onSubmit={handleSubmit} className='border-2 border-teal-400 rounded-md p-5'>
                        <textarea
                            value={comments}
                            onChange={(e) => handleChange(e)}
                            className={`border-2 p-3 rounded-lg w-full h-[100px] outline-none`}
                            placeholder='Add a comment...'>
                        </textarea>
                        <div className='flex items-center justify-between mt-5'>
                            <p className='text-sm text-gray-500'>{200 - comments.length} Characters Remaining</p>
                            <button type='submit' className='border-2 border-teal-400 p-2 rounded-lg'>Submit</button>
                        </div>
                    </form>
                )
            }
            {
                comment && comment.length < 0 ? (
                    <p>No Comments Yet!</p>
                ) : (
                    <div>
                        <div className='text-sm flex items-center gap-2 my-4'>
                            <p>Comments</p>
                            <div className='border py-1 px-2 rounded-sm border-gray-500'>
                                {comment.length}
                            </div>
                        </div>
                        <div>
                            {
                                comment && comment.map((item) => {
                                    return (
                                        <Comment item={item} key={item._id} onLike={handleLike} onEdit={handleUpdate}  />
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CommentsSection