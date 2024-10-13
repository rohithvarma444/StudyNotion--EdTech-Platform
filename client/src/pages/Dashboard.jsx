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
            <div className='flex-grow overflow-auto'>
                <div className='flex items-center justify-center min-h-full'>
                    <div className='w-11/12 max-w-[1000px]'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
