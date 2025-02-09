import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment';
import { BiSolidLike } from "react-icons/bi";
import { toast } from 'react-toastify';

const Comment = ({ item, onLike, onEdit }) => {
    const { currentUser } = useSelector((state) => state.user);
    const editRef = useRef(null);

    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(item.content)
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
    }, [item]);

    const handleEdit = () => {
        setIsEditing(true);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editRef.current && !editRef.current.contains(event.target)) {
                setIsEditing(false);
            }
        };

        if (isEditing) {
            window.addEventListener("click", handleClickOutside, true); // Use capture phase
        }

        return () => {
            window.removeEventListener("click", handleClickOutside, true);
        };
    }, [isEditing]);

    const handleSave = async () => {
        try {
          const res = await fetch(`/api/comment/editComment/${item._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: editedContent,
            }),
          });
          if (res.ok) {
            setIsEditing(false);
            onEdit(item, editedContent);
            toast.success('commented updated successfully')
          }
        } catch (error) {
          console.log(error.message);
        }
      };

    return (
        <>
            {
                user && (
                    <div className='w-full flex border-b-2 p-4 dark:border-b-gray-600 text-sm'>
                        <div className='flex-shrink-0 mr-3'>
                            <img className='w-10  h-10 rounded-full  light:bg-gray-200' src={user.profilePicture} alt={user.username} />
                        </div>
                        <div className='w-full'>
                            <div className='flex items-center mb-1 gap-2'>
                                <span className='font-bold text-sm mr-1 truncate'>
                                    {user ? `@${user.username}` : 'anonymous user'}
                                </span>
                                <span className='text-gray-400 text-xs'>
                                    {moment(item.createdAt).fromNow()}
                                </span>
                            </div>

                            {
                                isEditing ? (
                                    <div>
                                        <textarea
                                            // ref={editRef}
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className='border-teal-500 border w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none focus:bg-gray-100'
                                        />
                                        <div className='w-full flex items-center justify-end gap-3 mt-2'>
                                            <button
                                                onClick={handleSave}
                                                className='bg-blue-400 p-2 w-[80px]  rounded-lg'
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className='border border-blue-600 p-2 w-[80px]  rounded-lg'
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* comment part  */}
                                        <p p className='text-gray-500 mb-2'>{item.content}</p>

                                        {/* Like part */}
                                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                                            <button
                                                type='button'
                                                onClick={() => onLike(item._id)}
                                                className={`hover:text-blue-500 ${currentUser &&
                                                    item?.likes?.includes(currentUser._id) ?
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
                                            {
                                                currentUser && (currentUser.data._id === item._id) || currentUser.data.isAdmin && (
                                                    <button onClick={handleEdit} className='text-gray-500 text-xs'>
                                                        Edit
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div >
                )
            }
        </>
    )
}

export default Comment