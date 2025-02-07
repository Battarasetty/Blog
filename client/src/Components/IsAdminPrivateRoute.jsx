import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Signin from '../pages/Signin';

const IsAdminPrivateRoute = () => {
    const {currentUser} = useSelector((state) => state.user);
    return (
        <div>
            {
               currentUser?.data?.isAdmin && currentUser.data.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />
            }
        </div>
    )
}

export default IsAdminPrivateRoute