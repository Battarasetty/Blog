import React, { useEffect, useState } from 'react';
import { FaUserAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';
import { MdLocalPostOffice } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = new URLSearchParams(location.search);

    const [tab, setTab] = useState('');
    const { theme } = useSelector((state) => state.theme);
    const { currentUser } = useSelector((state) => state.user);

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
        const tabData = params.get('tab');
        setTab(tabData);
    }, [location.search]);

    const sidebarStyles = theme === 'light' ? 'bg-gray-300 text-black' : 'bg-[#10172A] text-white';

    const activeClass = theme === 'light'
        ? tab === 'profile' ? 'bg-gray-200' : ''
        : tab === 'profile' ? 'bg-[#1F2937]' : '';

    const hoverStyles = theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-[#1F2937]';
    return (
        <div className={`h-[calc(100vh-64px)] p-4 border-2 flex flex-col gap-10 ${sidebarStyles}`}>
            {/* Sidebar Content */}
            <div
                onClick={() => navigate('/dashboard?tab=profile')}
                className={`flex items-center gap-3 justify-between rounded-lg border-[2.5px] p-2 cursor-pointer 
                    ${activeClass} ${hoverStyles}`}
            >
                <div className='flex items-center gap-8'>
                    <FaUserAlt />
                    <h2>Profile</h2>
                </div>
                <div>
                    {
                        currentUser.data.isAdmin ? (
                            <p>Admin</p>
                        ) : (
                            <p>User</p>
                        )
                    }
                </div>
            </div>
            {
                currentUser.data.isAdmin && (
                    <div onClick={() => navigate('/dashboard?tab=posts')} className={`flex items-center gap-3 justify-between rounded-lg border-[2.5px] p-2 ${hoverStyles} cursor-pointer`}>
                        <div className='flex items-center gap-4'>
                            <MdLocalPostOffice />
                            <button>
                                Posts
                            </button>
                        </div>
                    </div>
                )
            }
            {
                currentUser.data.isAdmin && (
                    <div onClick={() => navigate('/dashboard?tab=users')} className={`flex items-center gap-3 justify-between rounded-lg border-[2.5px] p-2 ${hoverStyles} cursor-pointer`}>
                        <div className='flex items-center gap-4'>
                            <FaUsers />
                            <button>
                                Users
                            </button>
                        </div>
                    </div>
                )
            }
            <div className={`flex items-center gap-3 justify-between rounded-lg border-[2.5px] p-2 ${hoverStyles} cursor-pointer`}>
                <div className='flex items-center gap-4'>
                    <FaArrowRight />
                    <button onClick={handleSignout}>Signout</button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
