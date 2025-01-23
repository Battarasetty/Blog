import React, { useContext } from 'react'
import { FaGooglePlus } from "react-icons/fa";
import { ThemeContext } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const { isDarkTheme } = useContext(ThemeContext);

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
          <input type="text" className={`${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} p-2 border-[1px] ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} rounded-lg ${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`} />
        </div>
        <div className='flex flex-col gap-2'>
          <label className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Email</label>
          <input type="text" className={`${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} p-2 border-[1px] ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} rounded-lg ${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`} placeholder='Test@gmail.com' />
        </div>
        <div className='flex flex-col gap-2'>
          <label className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Password</label>
          <input type="text" className={`${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} p-2 border-[1px] ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} rounded-lg ${isDarkTheme ? 'text-[#fff]' : 'text-[black]'}`} />
        </div>
        <button className='p-2 border-2 border-[#ED5783] rounded-lg bg-[#AE58D7] mt-4 text-[#fff]'>Sign Up</button>
        <div className='p-2 border-2 border-[#ED5783] rounded-lg  mt-4 text-[#fff] flex items-center justify-center gap-10'>
          <FaGooglePlus size={20} className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`} />
          <button className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Continue With Google</button>
        </div>
        <p className={`${isDarkTheme ? 'text-[#fff]' : 'text-[black]'} ${isDarkTheme ? '' : 'font-semibold'}`}>Have an account? <span onClick={() => navigate('/sign-in')} className='text-[#59A9FA] text-sm ml-1.5 cursor-pointer'>Sign in</span></p>
      </div>
    </div>
  )
}

export default Signup