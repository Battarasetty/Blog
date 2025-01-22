import React, { useContext, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaGear } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { ThemeContext } from '../Context/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const menuItems = [
    {
      id: 1,
      title: 'Home',
      link: '/',
    },
    {
      id: 2,
      title: 'About',
      link: '/about',
    },
    {
      id: 3,
      title: 'Projects',
      link: '/projects',
    },
  ]

  //States
  const [searchValue, setSearchValue] = useState('');
  const [openMenu, setOpenMenu] = useState(false);

  //Functions
  const handleClick = () => {
    setOpenMenu(prev => !prev);
  };
  const handleGo = (href) => {
    navigate(href);
    setOpenMenu(false)
  }
  return (
    <div className={`flex justify-between items-center	p-10 ${isDarkTheme ? 'bg-slate-800' : 'bg-[#fff]'}  h-16 border-b-4	${isDarkTheme ? 'border-b-gray-600' : 'lighblue'}	relative`}>
      <div className='flex items-center justify-center gap-2 md:gap-8 '>
        <button className='bg-[#8C62F8] p-2 rounded-lg	text-[#fff] w-10 md:w-20 cursor-pointer text-sm md:text-xl'>
          <Link to='/'>
            Blog
          </Link>
        </button>
        <div className={`rounded-lg ${isDarkTheme ? "bg-[#374151]" : 'bg-blue-300'} flex items-center justify-center p-2.5`}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder='Search'
            className={`hidden md:block md:w-40 ${isDarkTheme ? "bg-[#374151]" : 'bg-blue-300'} rounded-lg border-none outline-none ${isDarkTheme ? 'text-[#fff]' : 'black'}`}
          />
          <div className="cursor-pointer">
            <CiSearch />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-9 '>
        {
          menuItems.map((item) => (
            <Link key={item.id} to={item.link}>
              <h1 className={`${isDarkTheme ? "text-[#fff]" : ''} cursor-pointer hidden md:block`}>{item.title}</h1>
            </Link>
          ))
        }
      </div>
      <div className='flex items-center justify-center gap-5'>
        <div className='p-2 md:p-2.5 rounded-lg border-2 border-[grey] cursor-pointer' onClick={toggleTheme}>
          {isDarkTheme ? <FaMoon /> : <FaGear />}
        </div>
        <h1 className={`border-2 border-[#2595DB] p-1 ${isDarkTheme ? 'text-[#fff]' : 'text-[#000]'} rounded-lg cursor-pointer text-sm md:text-xl`}>SignUp</h1>

        <div
          className="p-1.5 rounded-lg border-2 border-[grey] cursor-pointer md:hidden z-20"
          onClick={handleClick}
        >
          {openMenu ? (
            <MdOutlineCancel size={20} />
          ) : (
            <IoMenu size={20} />
          )}
        </div>
      </div>


      {
        openMenu && (
          <div className='absolute top-0 left-0 right-0 bottom-0 h-[100vh] bg-[#1E293B]'>
            <ul className='flex items-center justify-center flex-col h-[100%] gap-10'>
              {menuItems.map((item) => (
                <li className='text-[#fff] text-xl cursor-pointer font-bold' onClick={() => handleGo(item.link)} key={item.id}>{item.title}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  )
}

export default Header