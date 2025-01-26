import React, { useContext, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaGear } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { ThemeContext } from '../Context/ThemeContext';
import { useSelector } from 'react-redux';

const Header = ({ style }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(location.pathname);
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
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
  const [openDropdown, setOpenDropdown] = useState(false);

  //Functions
  const handleClick = () => {
    setOpenMenu(prev => !prev);
  };
  const handleGo = (href) => {
    navigate(href);
    setOpenMenu(false)
  }
  const handleDropdown = () => {
    setOpenDropdown((prev) => !prev)
  }
  return (
    <div className={`h-16 flex justify-between items-center	p-10 ${isDarkTheme ? 'bg-slate-800' : 'bg-[#fff]'}  border-b-4	${isDarkTheme ? 'border-b-gray-600' : 'lighblue'} fixed w-full`}>
      <div className='flex items-center justify-center gap-2 md:gap-8 '>
        <button className='bg-[#AE58D7] border-2 border-[#ED5783] p-2 rounded-lg	text-[#fff] w-10 md:w-20 cursor-pointer text-sm md:text-xl'>
          <Link to='/'>
            Blog
          </Link>
        </button>
        <div className={`rounded-lg ${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} flex items-center justify-center p-2.5 ${isDarkTheme ? 'border-gray-200' : 'border-red-300'} border-[1px]`}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder='Search'
            className={`hidden md:block md:w-40 ${isDarkTheme ? 'bg-[#374151]' : 'bg-[#F9FAFB]'} rounded-lg border-none outline-none ${isDarkTheme ? 'text-[#fff]' : 'black'}`}
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
        {
          currentUser ? (
            <div className='rounded-lg relative cursor-pointer' onClick={handleDropdown}>
              <img src={currentUser.data.profilePicture} alt="user image" className='rounded-lg w-9 h-10' />
              {
                openDropdown && (
                  <div className='absolute right-[1px]  rounded-lg mt-2 bg-[#374151]'>
                    <div className='flex flex-col gap-3 p-5'>
                      <p className='text-[#fff]'>{currentUser.data.username}</p>
                      <p className='text-[#fff]'>{currentUser.data.email}</p>
                      <div className='flex flex-col gap-3'>
                        <Link to={'/dashboard?tab=profile'} className='text-[#fff]'>
                          Profile
                        </Link>
                        <Link className='text-[#fff]'>
                          signout
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          ) : (
            location.pathname === '/' || location.pathname === '/sign-in') && (
            <button onClick={() => navigate('/sign-up')} className={`border-2 border-[#2595DB] p-1 ${isDarkTheme ? 'text-[#fff]' : 'text-[#000]'} w-[90px] rounded-lg cursor-pointer text-sm md:text-xl`}>
              SignUp
            </button>
          )
        }

        {
          location.pathname === '/sign-up' && (
            <button onClick={() => navigate('/sign-in')} className={`border-2 border-[#2595DB] p-1 ${isDarkTheme ? 'text-[#fff]' : 'text-[#000]'} w-[90px] rounded-lg cursor-pointer text-sm md:text-xl`}>
              SignIn
            </button>
          )
        }
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