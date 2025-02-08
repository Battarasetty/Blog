import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CommentsSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user);
    // console.log(postId);

    const [comments, setComments] = useState('');

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
            }
        } catch (error) {
            toast.error("something went wrong")
        }
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
        </div>
    )
}

export default CommentsSection