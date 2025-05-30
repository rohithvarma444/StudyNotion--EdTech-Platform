import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/core/Dashboard/Sidebar';


function Dashboard() {

    const {loading: authLoading} = useSelector((state) => state.auth);
    const {loading: profileLoading} = useSelector((state) => state.profile);

    if(profileLoading || authLoading){
        return(
            <div className='flex items-center justify-center h-screen'>
                Loading...
            </div>
        )
    }

    return (
        <div className='flex min-h-[calc(100vh-3.5rem)]'>
            <Sidebar />
            <div className='flex-1 overflow-auto'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
