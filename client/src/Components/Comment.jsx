import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment';
import { BiSolidLike } from "react-icons/bi";

const Comment = ({ item, onLike }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [user, setUser] = useState(null)
    // console.log(item);

    useEffect(() => {
        const getComment = async () => {
            try {
                const response = await fetch(`/api/user/${currentUser.data._id}`);
                const result = await response.json();
                if (result.status === 200) {
                    setUser(result.rest)
                }
            } catch (error) {
                console.log(error);
            }
        }

        getComment();
    }, [item])

    return (
        <>
            {
                user && (
                    <div className='flex border-b-2 p-4 dark:border-b-gray-600 text-sm'>
                        <div className='flex-shrink-0 mr-3'>
                            <img className='w-10  h-10 rounded-full  light:bg-gray-200' src={user.profilePicture} alt={user.username} />
                        </div>
                        <div>
                            <div className='flex items-center mb-1 gap-2'>
                                <span className='font-bold text-sm mr-1 truncate'>
                                    {user ? `@${user.username}` : 'anonymous user'}
                                </span>
                                <span className='text-gray-400 text-xs'>
                                    {moment(item.createdAt).fromNow()}
                                </span>
                            </div>
                            <p className='text-gray-500 mb-2'>{item.content}</p>
                            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                                <button
                                    type='button'
                                    onClick={() => onLike(item._id)}
                                    className={`hover:text-blue-500 ${currentUser &&
                                        item.likes.includes(currentUser._id) ?
                                        'text-blue-500' : 'text-gray-500'
                                        }`}
                                >
                                    <BiSolidLike size={20} />
                                </button>
                                <p className='text-gray-400'>
                                    {item.numberOfLikes > 0 &&
                                        item.numberOfLikes +
                                        ' ' +
                                        (item.numberOfLikes === 1 ? 'like' : 'likes')}
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Comment