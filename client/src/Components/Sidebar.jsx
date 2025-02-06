import React, { useEffect, useState } from 'react';
import { FaUserAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';  // Assuming Redux for theme management
import { updateSuccess } from '../redux/user/userSlice';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = new URLSearchParams(location.search);
    
    const [tab, setTab] = useState('');
    const { theme } = useSelector((state) => state.theme);

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
        <div className={`w-[20vw] md:w-[250px] h-[calc(100vh-64px)] p-4 border-2 flex flex-col gap-10 ${sidebarStyles}`}>
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
                    <p>User</p>
                </div>
            </div>
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
