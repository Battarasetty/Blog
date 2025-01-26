import React, { useContext, useState } from 'react'
import { FaGooglePlus } from "react-icons/fa";
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js'
import { useDispatch } from 'react-redux';
import { signUpStart, signUpSuccess, signUpFailure } from '../redux/user/userSlice';

const initialData = {
  username: '',
  email: '',
  password: '',
}
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const { isDarkTheme } = useContext(ThemeContext);


  //States :-
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  //Functions :-
  const handleChange = (name, e) => {
    const value = e.target.value
    setFormData((prevData) => (
      { ...prevData, [name]: value.trim() }
    ))
  }

  const handleSubmit = async () => {
    dispatch(signUpStart)
    if (!formData.username || !formData.email || !formData.password) {
      // setLoading(false);
      return toast.error('Please fill out all fields')
    } else if (formData.username.length < 4 || formData.username > 10) {
      // setLoading(false);
      return toast.error('Length should be between 4 - 10')
    }
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const output = await response.json();
      if (output.success === false) {
        toast.error(output.message)
      } else if (output.status === 200) {
        navigate('/sign-in');
      }
      dispatch(signUpSuccess)
    } catch (error) {
      toast.error(error.message)
      dispatch(signUpFailure)
    }
  }

  const handleGoogleClick = async () => {
    dispatch(signUpStart())
    const auth = getAuth(app)

    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      // console.log(resultsFromGoogle);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoUrl: resultsFromGoogle.user.photoURL
          }
        )
      })
      const data = await res.json();
      if (res.ok) {
        dispatch(signUpSuccess(data))
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      dispatch(signUpFailure(error.message))
    }
  };
  return (
    <div className={`h-screen overflow-auto flex items-center justify-center ${isDarkTheme ? "bg-[#10172A]" : 'bg-[#fff]'} `}>
      {/* Left */}
      <div className="hidden md:flex flex-col gap-3 justify-start p-10 w-[400px]">
        <h1 className='p-2 border-[#ED5783] rounded-lg bg-[#AE58D7] text-[#fff] text-4xl w-[100px] flex items-center justify-center border-2 border-[#ED5783]'>Blog</h1>
        <p className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`}>You can sign up with your email and password or with Google.</p>
      </div>
      {/* Right  */}
      <div className='flex flex-col gap-3 w-[500px] p-10 mt-20'>
        <div className='flex flex-col gap-2'>
          <label className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Username</label>
          <input value={formData.username} name="username" onChange={(e) => handleChange('username', e)} type="text" className={`${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} p-2 border-[1px] ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} rounded-lg ${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`} />
        </div>
        <div className='flex flex-col gap-2'>
          <label className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Email</label>
          <input value={formData.email} name="email" onChange={(e) => handleChange('email', e)} type="email" className={`${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} p-2 border-[1px] ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} rounded-lg ${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`} placeholder='Test@gmail.com' />
        </div>
        <div className='flex flex-col gap-2'>
          <label className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Password</label>
          <input value={formData.password} name="password" onChange={(e) => handleChange('password', e)} type="password" className={`${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} p-2 border-[1px] ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} rounded-lg ${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`} />
        </div>
        <button onClick={handleSubmit} className='p-2 border-2 border-[#ED5783] rounded-lg bg-[#AE58D7] mt-4 text-[#fff]'>
          {loading ? (
            <div className='flex items-center justify-center gap-2'>
              <ClipLoader size={20} color='white' />
              <span>Loading</span>
            </div>
          ) : 'Sign Up'
          }
        </button>
        <div onClick={handleGoogleClick} className='cursor-pointer p-2 border-2 border-[#ED5783] rounded-lg  mt-4 text-[#fff] flex items-center justify-center gap-10'>
          <FaGooglePlus size={20} className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`} />
          <button className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Continue With Google</button>
        </div>
        <p className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Have an account? <span onClick={() => navigate('/sign-in')} className='text-[#59A9FA] text-sm ml-1.5 cursor-pointer'>Sign in</span></p>
      </div>
    </div>
  )
}

export default Signup