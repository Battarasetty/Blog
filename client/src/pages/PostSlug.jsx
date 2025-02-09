import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import CallToAction from '../Components/CallToAction';
import CommentsSection from '../Components/CommentsSection';

const PostSlug = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostSlug = async () => {
            try {
                const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const result = await response.json();
                if (response.ok) {
                    setPost(result.posts[0]);
                    setError(false);
                } else {
                    setError('Something went wrong');
                }
            } catch (error) {
                setError('Something went wrong');
                toast.error('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchPostSlug();
    }, [postSlug]);

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen w-screen overflow-hidden'>
                <SyncLoader color='#d635cd' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center h-screen w-screen overflow-hidden'>
                <p className='text-red-500'>{error}</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center mx-auto max-w-3xl p-5 w-full overflow-hidden'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif lg:text-4xl'>
                {post?.title}
            </h1>
            <Link to={`/search?category=${post?.category}`} className='mt-5'>
                <button className='text-gray-400'>{post?.category}</button>
            </Link>
            <img
                src={post?.image}
                alt={post?.title}
                className='mt-10 w-full max-w-[200px] h-auto object-cover rounded-lg'
            />
            <div className='flex justify-between p-3 border-b border-slate-500 w-full text-xs'>
                <span>{new Date(post?.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{(post?.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div
                className='p-3 w-full max-w-3xl post-content overflow-x-hidden'
                dangerouslySetInnerHTML={{ __html: post?.content }}
            ></div>
            <div>
                <CallToAction />
            </div>
            <div className='w-full'>
                <CommentsSection postId={post._id} />
            </div>
        </div>
    );
};

export default PostSlug;