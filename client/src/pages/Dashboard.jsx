import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadStart, uploadSuccess, uploadFailure, updateSuccess, updateStart, updateFailure } from '../redux/user/userSlice';

const Dashboard = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const { theme } = useSelector((state) => state.theme);
  const { currentUser, loading } = useSelector((state) => state.user);

  // States
  const [tab, setTab] = useState('');
  const [imageFiles, setImageFiles] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: ''
  });
  const [initialFormData, setInititalFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: ''
  });
  console.log(isButtonDisabled, loading);

  const inputRef = useRef();

  // Initialize form data when currentUser is available
  useEffect(() => {
    if (currentUser?.data) {
      setFormData({
        username: currentUser.data.username || '',
        email: currentUser.data.email || '',
        password: '',
        profilePicture: currentUser.data.profilePicture || '',
      });
      setInititalFormData({
        username: currentUser.data.username || '',
        email: currentUser.data.email || '',
        password: '',
        profilePicture: currentUser.data.profilePicture || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialFormData) {
      setIsButtonDisabled(JSON.stringify(initialFormData) === JSON.stringify(formData))
    }
  }, [formData, initialFormData])


  // Handle input changes
  const handleChange = (id, e) => {
    setFormData((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Upload image
  const uploadImage = async () => {
    dispatch(uploadStart());
    try {
      const formData = new FormData();
      formData.append("image", imageFiles);

      const result = await fetch(`/api/user/upload`, {
        method: "POST",
        body: formData,
      });
      const response = await result.json();

      if (response.statusCode === 500) {
        dispatch(uploadFailure());
        toast.error(response.message);
      } else {
        setFormData((prev) => ({
          ...prev,
          profilePicture: response.data.secure_url,
        }));
        dispatch(uploadSuccess());
        toast.success(response.message);
      }
    } catch (error) {
      dispatch(uploadFailure())
      toast.error("Error uploading image");
    }
  };

  // Trigger upload when image is selected
  useEffect(() => {
    if (imageFiles) {
      uploadImage();
    }
  }, [imageFiles]);

  useEffect(() => {
    const tabData = params.get('tab');
    setTab(tabData);
  }, [location.search]);

  const handleUpdateUser = async () => {
    try {
      dispatch(updateStart());
      const result = await fetch(`/api/user/update/${currentUser.data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const res = await result.json();
      // console.log(res);
      if (res.status !== 200) {
        dispatch(updateFailure())
        toast.error(res.message)
      } else {
        dispatch(updateSuccess(res))
        toast.success(res.msg)
      }
    } catch (error) {
      dispatch(updateFailure());
      toast.error(error);
    }
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center border-2 p-4 gap-10">
        <div>
          <h1 className="text-center mb-5 text-lg font-bold uppercase">Profile</h1>
          <div className="cursor-pointer border-2 p-3 rounded-full bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={inputRef}
            />
            <div className="border-2 rounded-full bg-[#7B1FA2]" onClick={() => inputRef.current.click()}>
              <p className="font-bold text-4xl text-white">
                {formData.profilePicture || imageFileUrl ? (
                  <img
                    src={imageFileUrl || formData.profilePicture}
                    className="rounded-full w-40 h-40"
                    alt="Profile"
                  />
                ) : (
                  formData.username.slice(0, 1)
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e)}
            className={`w-[400px] rounded-lg p-2 border-2 outline-none ${theme === 'light' ? 'text-black' : 'text-gray-500'}`}
            placeholder="Enter Name"
          />
          <input
            type="text"
            value={formData.email}
            onChange={(e) => handleChange("email", e)}
            className={`w-[400px] rounded-lg p-2 border-2 outline-none ${theme === 'light' ? 'text-black' : 'text-gray-500'}`}
            placeholder="Enter Email"
          />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e)}
            className={`w-[400px] rounded-lg p-2 border-2 outline-none ${theme === 'light' ? 'text-black' : 'text-gray-500'}`}
            placeholder="Enter Password"
          />
          <button disabled={isButtonDisabled || loading} onClick={handleUpdateUser}
            className={`w-[400px] rounded-lg p-2 border-2 border-purple-500 
            ${isButtonDisabled || loading ? "cursor-not-allowed opacity-50" : "hover:bg-purple-500 hover:text-white"}`}
          >
            {loading ? "Uploading..." : "Update"}
          </button>
          <div className="flex items-center justify-between">
            <h2 className="cursor-pointer text-red-400">Delete</h2>
            <h2 className="cursor-pointer text-red-400">Sign Out</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
