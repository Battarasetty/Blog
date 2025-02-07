import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uploadFailure, uploadStart, uploadSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const initialData = {
    title: '',
    category: '',
    content: '',
};

const UpdatePost = () => {
    const { theme } = useSelector((state) => state.theme);
    const { currentUser } = useSelector((state) => state.user);
    const { postId } = useParams();
    // console.log(postId);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // states 
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState(initialData)
    console.log(formData);

    // functions 
    const handleChange = (name, e) => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    };
    const handleUploadRef = async () => {
        if (!file) {
            toast.error('File Not There')
            return
        }

        dispatch(uploadStart());
        try {
            const formData = new FormData();
            formData.append("image", file);

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
                    image: response.data.secure_url,
                }));
                dispatch(uploadSuccess());
                toast.success(response.message);
            }
        } catch (error) {
            dispatch(uploadFailure())
            toast.error("Error uploading image");
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/post/updatepost/${currentUser.data._id}/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const result = await response.json();
            if (result.status === 200) {
                setFormData(initialData);
                setFile('');
                navigate(`/post/${result.updatedPost.slug}`)
                toast.success('Post Updated Successfully')
            } else if (result.statusCode === 403) {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('Something went wrong')
        }
    }


    useEffect(() => {
        const getPostById = async () => {
            try {
                const response = await fetch(`/api/post/getposts?postId=${postId}`)
                const result = await response.json();
                if (response.status === 200) {
                    setFormData(result.posts[0])
                }
            } catch (error) {
                toast.error('something went wrong')
            }
        }

        getPostById();
    }, [postId])


    return (
        <div className='flex items-center justify-center overflow-auto h-[631px]'>
            <div className='w-[800px]'>
                <div className='p-10 flex flex-col items-center justify-center gap-5 w-full'>
                    <div className=''>
                        <h1 className='text-lg font-bold text-purple-400'>Update Post</h1>
                    </div>
                    <div className='flex items-center w-full gap-4'>
                        <input value={formData.title} onChange={(e) => handleChange('title', e)} type="text" placeholder='Title' className={`border-2 p-3 rounded-lg w-[70%] outline-none ${theme === 'light' ? 'text-black' : 'text-black'}`} />
                        <select className='border-2 p-3 rounded-lg w-[30%] cursor-pointer' name="" id="" value={formData.category} onChange={(e) => handleChange('category', e)}>
                            {!formData.category && <option value="" disabled>Select category</option>}
                            <option value="reactjs">Reactjs</option>
                            <option value="nextjs">Nextjs</option>
                            <option value="redux">Redux</option>
                        </select>
                    </div>
                    <div className='flex items-center justify-between p-5 border-dotted border-2 border-purple-400 rounded-lg h-[100px] w-full'>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <button className='border-2 border-purple-400 rounded-lg p-5 cursor-pointer' onClick={handleUploadRef}>
                            Upload Image
                        </button>
                    </div>
                    <div className='w-full'>
                        <textarea
                            value={formData.content}
                            onChange={(e) => handleChange('content', e)}
                            className={`border-2 p-3 rounded-lg w-full h-[200px] outline-none ${theme === 'light' ? 'text-black' : 'text-black'}`}
                            placeholder='Write your post content here...'>
                        </textarea>
                    </div>
                    <div className='w-full'>
                        <button onClick={handleUpdate} className='w-full rounded-lg p-2 bg-purple-400'>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdatePost