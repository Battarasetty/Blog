import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import CallToAction from '../Components/CallToAction';
import CommentsSection from '../Components/CommentsSection';
import PostCard from '../Components/PostCard';

const PostSlug = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);

    const fetchRecentPosts = async () => {
        try {
            const response = await fetch(`/api/post/getposts?limit=3`);
            const result = await response.json();
            if (result.status === 200) {
                setRecentPosts(result?.posts);
            }
        } catch (error) {
            toast.error('something went wrong')
        }
    };

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
        fetchRecentPosts();
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
    };

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
                className='my-5 w-full max-w-[500px] h-[400px] object-cover object-fill'
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

            <div className='flex flex-col justify-center items-center mb-5'>
                <h1>Recent Articles</h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                    {
                        recentPosts && recentPosts.map((post) => {
                            return (
                                <PostCard post={post} key={post._id} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default PostSlug;