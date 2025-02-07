import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Posts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState()
  // console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/post/getposts?userId=${currentUser?.data?._id}`);
        const result = await response.json();
        if (result.posts.length < 9) {
          setShowMore(false)
        }
        setUserPosts(result.posts);
      } catch (error) {
        toast.error('Something went wrong');
      }
    };

    if (currentUser?.data?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    try {
      const startIndex = userPosts.length
      const response = await fetch(`/api/post/getposts?userId=${currentUser?.data?._id}&startIndex=${startIndex}`);
      const result = await response.json();
      if (result.posts.length < 9) {
        setShowMore(false)
      }
      setUserPosts((prev) => [...prev, ...result.posts])
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleModal = (postId) => {
    setShowModal(true);
    setPostIdToDelete(postId)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/post/deleteposts/${postIdToDelete}/${currentUser.data._id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.status === 200) {
        toast.success(result.msg)
        setUserPosts((prev) => (
          prev.filter((item) => item._id !== postIdToDelete)
        ));
        setShowModal(false)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="w-full h-full">
      {userPosts && userPosts.length > 0 ? (
        <div className="w-full border rounded-lg shadow-lg">
          <div className="overflow-y-auto max-h-[580px]">
            <table className="w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 z-10">
                <tr className="text-left text-gray-700 dark:text-gray-300">
                  <th className="px-6 py-3 border-b">Date Updated</th>
                  <th className="px-6 py-3 border-b">Post Image</th>
                  <th className="px-6 py-3 border-b">Post Title</th>
                  <th className="px-6 py-3 border-b">Category</th>
                  <th className="px-6 py-3 border-b">Delete</th>
                  <th className="px-6 py-3 border-b">Edit</th>
                </tr>
              </thead>
              <tbody>
                {userPosts.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 ">{new Date(user.updatedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Link to={`/post/${user.slug}`}>
                        <div className="w-20 h-10 overflow-hidden rounded-md">
                          <img
                            src={user.image}
                            alt={user.title}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4  font-medium text-gray-900 dark:text-white">
                      <Link to={`/post/${user.slug}`} className="hover:underline">
                        {user.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 ">{user.category}</td>
                    <td onClick={() => handleModal(user._id)} className="px-6 py-4  text-red-500 hover:underline cursor-pointer">
                      <span>Delete</span>
                    </td>
                    <td className="px-6 py-4  text-teal-500 hover:underline">
                      <Link to={`/update-post/${user._id}`}>
                        Edit
                      </Link>
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
        <p className="text-gray-600 dark:text-gray-300 text-center mt-4">You have no posts yet to show</p>
      )}

      {
        showModal && (
          <div className='w-full h-full fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[1000] bg-gray-300'>
            <div className='relative w-[500px] p-[80px] bg-[#fff] rounded-md'>
              <div onClick={() => setShowModal(false)} className='cursor-pointer absolute right-5 top-5 flex items-center justify-center border-2 border-black p-2 rounded-lg text-black'>X</div>
              <div className='flex flex-col gap-5'>
                <p className='text-center text-black'>Are you sure you want to delete your Post?</p>
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

export default Posts;
