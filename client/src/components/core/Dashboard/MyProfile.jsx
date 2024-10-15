import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../../services/operations/profileAPI';
import { FaRegEdit } from "react-icons/fa";

function MyProfile() {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate(); 
    const {token} = useSelector((state) => state.auth)

    useEffect(() => {
        const getUserFullDetails = async() => {
            const response = getUserDetails(token,navigate)
        }
        getUserFullDetails();
    },[])

    return (
        <div className='text-white w-10/12 mx-auto justify-center items-center'>
            <h1 className='text-3xl font-medium mb-6 mt-10'>
                My Profile
            </h1>
            
            {/* Section 1: Profile Info */}
            <div className='flex items-center justify-between bg-richblack-800 border-[1px] border-richblack-700 rounded-md p-6 mb-6'>
                <div className='flex items-center gap-x-4'>
                    <img 
                        src={user?.image}
                        alt={`profile-${user?.firstName}`}
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <div>
                        <p className='text-lg font-semibold'>
                            {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className='text-sm text-richblack-300'>{user?.email}</p>
                    </div>
                </div>
                <button 
                    className='flex items-center gap-2 text-sm text-yellow-50 font-medium'
                    onClick={() => navigate("/dashboard/settings")}
                >
                    <FaRegEdit />
                    Edit
                </button>
            </div>

            {/* Section 2: About */}
            <div className='bg-richblack-800 border-[1px] border-richblack-700 rounded-md p-6 mb-6'>
                <div className='flex justify-between items-center mb-4'>
                    <p className='text-lg font-semibold'>About</p>
                    <button 
                        className='flex items-center gap-2 text-sm text-yellow-50 font-medium'
                        onClick={() => navigate("/dashboard/settings")}
                    >
                        <FaRegEdit />
                        Edit
                    </button>
                </div>
                <p className='text-sm text-richblack-300'>
                    {user?.additionalDetails?.about ?? "Write Something about Yourself"}
                </p>
            </div>

            {/* Section 3: Personal Details */}
            <div className='bg-richblack-800 border-[1px] border-richblack-700 rounded-md p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <p className='text-lg font-semibold'>Personal Details</p>
                    <button 
                        className='flex items-center gap-2 text-sm text-yellow-50 font-medium'
                        onClick={() => navigate("/dashboard/settings")}
                    >
                        <FaRegEdit />
                        Edit
                    </button>
                </div>

                {/* Personal Details Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8'>
                    {[
                        { label: "First Name", value: user?.firstName },
                        { label: "Last Name", value: user?.lastName },
                        { label: "Email", value: user?.email },
                        { label: "Gender", value: user?.additionalDetails?.gender ?? "Add Gender" },
                        { label: "Phone Number", value: user?.additionalDetails?.contactNumber ?? "Add Contact Number" },
                        { label: "Date of Birth", value: user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth" },
                    ].map((item, index) => (
                        <div key={index}>
                            <p className='text-sm text-richblack-600'>{item.label}</p>
                            <p className='text-sm font-medium'>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
