import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Users = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState()
    // console.log(users);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/user/users`);
                const result = await response.json();
                if (result.users.length < 9) {
                    setShowMore(false)
                }
                setUsers(result.users);
            } catch (error) {
                toast.error('Something went wrong');
            }
        };

        if (currentUser?.data?.isAdmin) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleShowMore = async () => {
        try {
            const startIndex = users.length
            const response = await fetch(`/api/user/users?startIndex=${startIndex}`);
            const result = await response.json();
            if (result.users.length < 9) {
                setShowMore(false)
            }
            setUsers((prev) => [...prev, ...result.posts])
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleModal = (userId) => {
        setShowModal(true);
        setUserIdToDelete(userId)
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.status === 200) {
                toast.success(result.msg)
                setUsers((prev) => (
                    prev.filter((item) => item._id !== userIdToDelete)
                ));
                setShowModal(false)
            }
        } catch (error) {
            toast.error('Something went wrong')
        }
    }

    return (
        <div className="w-full h-full">
            {users && users.length > 0 ? (
                <div className="w-full border rounded-lg shadow-lg">
                    <div className="overflow-y-auto max-h-[580px]">
                        <table className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10">
                                <tr className="text-left text-gray-700 dark:text-gray-300">
                                    <th className="px-6 py-3 border-b">DATE CREATED</th>
                                    <th className="px-6 py-3 border-b">USER IMAGE</th>
                                    <th className="px-6 py-3 border-b">USERNAME</th>
                                    <th className="px-6 py-3 border-b">EMAIL</th>
                                    <th className="px-6 py-3 border-b">ADMIN</th>
                                    <th className="px-6 py-3 border-b">DELETE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 ">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 flex items-center justify-center">
                                            <div className="w-[50px] h-[50px] overflow-hidden rounded-full">
                                                <img
                                                    src={user.profilePicture}
                                                    alt={user.username}
                                                    className="w-full h-full object-cover object-center rounded-full"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4  font-medium text-gray-900 dark:text-white">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4  font-medium text-gray-900 dark:text-white">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4  font-medium text-gray-900 dark:text-white">
                                            {/* <Link to={`/post/${user.slug}`} className="hover:underline"> */}
                                                {
                                                    user.isAdmin
                                                        ?
                                                        (
                                                            <FaCheck className='text-green-500' />
                                                        ) : (
                                                            <RxCross2 className='text-red-500' />
                                                        )
                                                }
                                            {/* </Link> */}
                                        </td>
                                        <td onClick={() => handleModal(user._id)} className="px-6 py-4  text-red-500 hover:underline cursor-pointer">
                                            <span>Delete</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {
                        showMore && (
                            <div onClick={handleShowMore} className='w-full flex items-center justify-center'>
                                <button className='rounded-lg p-[6px] border-2 border-purple-400'>Show More</button>
                            </div>
                        )
                    }
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center mt-4">You have no Users yet to show</p>
            )}

            {
                showModal && (
                    <div className='w-full h-full fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[1000] bg-gray-300'>
                        <div className='relative w-[500px] p-[80px] bg-[#fff] rounded-md'>
                            <div onClick={() => setShowModal(false)} className='cursor-pointer absolute right-5 top-5 flex items-center justify-center border-2 border-black p-2 rounded-lg text-black'>X</div>
                            <div className='flex flex-col gap-5'>
                                <p className='text-center text-black'>Are you sure you want to delete this User?</p>
                                <div className='flex items-center gap-5 justify-center'>
                                    <button onClick={() => handleDelete()} className='border-3 border-gray-50 bg-red-600 rounded-md p-2 text-white'>Yes, i'm Sure</button>
                                    <button onClick={() => setShowModal(false)} className='border-2 border-[black] rounded-md p-1 text-black'>No Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Users;
