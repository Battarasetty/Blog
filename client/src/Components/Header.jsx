import React, { useContext, useEffect, useRef, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { FaMoon } from "react-icons/fa";
import { IoSunnySharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { updateSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';

const Header = ({ style }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  // console.log(modalRef.current);
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  // console.log(currentUser);
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
  };

  const handleSignout = async () => {
    try {
      const response = await fetch('/api/user/signout', {
        method: 'POST'
      })
      if (response.status === 200) {
        toast.success("User Signed Out Successfully")
        dispatch(updateSuccess(null))
      } else {
        toast.error('somethingwent wrong!')
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    if (openDropdown) {
      window.addEventListener('click', handleClickOutside)
    }

    return () => {
      window.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  return (
    <div className={`flex justify-between items-center border-b-4 py-2 px-4 z-999 fixed w-full`}>
      <div className='flex items-center justify-center gap-2 md:gap-8 '>
        <button className='bg-[#AE58D7] border-2 border-[#ED5783] p-2 rounded-lg	text-[#fff] w-10 md:w-20 cursor-pointer text-sm md:text-xl'>
          <Link to='/'>
            Blog
          </Link>
        </button>
        <div className={`rounded-lg  flex items-center justify-center p-2.5  border-[1px]`}>
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder='Search'
            className={`hidden md:block md:w-40 rounded-lg border-none outline-none 
              ${theme === 'light' ? (
                'bg-white'
              ) : (
                'bg-[#10172A] text-white'
              )
              }
          `}
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
              <h1 className={`cursor-pointer hidden md:block`}>{item.title}</h1>
            </Link>
          ))
        }
      </div>
      <div className='flex items-center justify-center gap-5'>
        <div className='p-2 md:p-2.5 rounded-lg border-2 border-[grey] cursor-pointer' onClick={() => dispatch(toggleTheme())}>
          {
            theme === 'light' ? (
              <FaMoon />
            ) : (
              <IoSunnySharp />
            )
          }
        </div>
        {
          currentUser ? (
            <div className='rounded-lg relative cursor-pointer' ref={modalRef} onClick={handleDropdown}>
              <img src={currentUser.data.profilePicture} alt="user image" className='rounded-lg w-9 h-10' />
              {
                openDropdown && (
                  <div className={`absolute right-[1px]  rounded-lg mt-2 
                    ${theme === 'light' ? (
                      'bg-[#D1D5DB]'
                    ) : (
                      'bg-[#374151] text-white'
                    )
                    }
                    `}
                  >
                    <div className='flex flex-col gap-3 p-5'>
                      <p className=''>{currentUser.data.username}</p>
                      <p className=''>{currentUser.data.email}</p>
                      <div className='flex flex-col gap-3'>
                        <Link to={'/dashboard?tab=profile'} className=''>
                          Profile
                        </Link>
                        <button onClick={handleSignout}>
                          signout
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          ) : (
            location.pathname === '/' || location.pathname === '/sign-in') && (
            <button onClick={() => navigate('/sign-up')} className={`border-2 border-[#2595DB] p-1  w-[90px] rounded-lg cursor-pointer text-sm md:text-xl`}>
              SignUp
            </button>
          )
        }

        {
          location.pathname === '/sign-up' && (
            <button onClick={() => navigate('/sign-in')} className={`border-2 border-[#2595DB] p-1  w-[90px] rounded-lg cursor-pointer text-sm md:text-xl`}>
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