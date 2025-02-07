import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Posts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
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
                    <td className="px-6 py-4 ">
                      <Link to={`/post/${user.slug}`}>
                        <img src={user.image} alt={user.title} className="w-20 h-10 object-cover rounded-md" />
                      </Link>
                    </td>
                    <td className="px-6 py-4  font-medium text-gray-900 dark:text-white">
                      <Link to={`/post/${user.slug}`} className="hover:underline">
                        {user.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 ">{user.category}</td>
                    <td className="px-6 py-4  text-red-500 hover:underline cursor-pointer">
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
    </div>
  );
};

export default Posts;
