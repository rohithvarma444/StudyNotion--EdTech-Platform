import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { getUserDetails } from '../../../services/operations/profileAPI';


function MyProfile() {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate(); 
    const {token} = useSelector((state) => state.auth)

    useEffect(() => {
        const getUserFullDetails = async() => {
            const response = getUserDetails(token,navigate)
            console.log("In My Profile",response)
        }
        getUserFullDetails();
    },[])

    return (
        <div className='text-white p-8 bg-richblack-900 rounded-md max-w-4xl mx-auto items-center flex flex-col'>

            {/* Profile Heading */}
            <h1 className='text-3xl font-bold mb-6'>
                My Profile
            </h1>
            
            {/* Section 1: Profile Info */}
            <div className='flex items-center justify-center mb-8 w-full bg-richblack-700 px-7 py-7 mx-auto rounded-md'>
                <div className='flex items-center gap-x-4'>
                    <img 
                        src={user?.image}
                        alt={`profile-${user?.firstName}`}
                        className='w-20 h-20 rounded-full object-cover border-2 border-richblack-700'
                    />
                    <div>
                        <p className='text-xl font-semibold'>
                            {user?.firstName + " " + user?.lastName}
                        </p>
                        <p className='text-richblack-300'>{user?.email}</p>
                    </div>
                </div>
                <IconBtn
                    text="Edit"
                    onclick={() => navigate("/dashboard/settings")}
                    customClasses='bg-yellow-500 hover:bg-yellow-600 text-richblack-900 ml-10 text-white px-2 py-2 rounded-md'
                />
            </div>

            {/* Section 2: About */}
            <div className='mb-8 bg-richblack-700 rounded-md w-full p-5 '>
                <div className='flex justify-between items-center gap-x-5'>
                    <p className='text-lg font-semibold'>About</p>
                    <IconBtn
                        text="Edit"
                        onclick={() => navigate("/dashboard/settings")}
                        customClasses='bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md'
                    />
                </div>
                <p className='text-richblack-300 mt-2'>
                    {user?.additionalDetails?.about ?? "Write Something about Yourself"}
                </p>
            </div>

            {/* Section 3: Personal Details */}
            <div className='bg-richblack-700 p-5 rounded-md'>
                <div className='flex justify-between items-center mb-4 '>
                    <p className='text-lg font-semibold'>Personal Details</p>
                    <IconBtn
                        text="Edit"
                        onclick={() => navigate("/dashboard/settings")}
                        customClasses='bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-md'
                    />
                </div>

                {/* Personal Details Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-7 gap-x-10 '>
                    <div>
                        <p className='text-richblack-400'>First Name</p>
                        <p className='text-richblack-200'>{user?.firstName}</p>
                    </div>
                    <div>
                        <p className='text-richblack-400'>Last Name</p>
                        <p className='text-richblack-200'>{user?.lastName}</p>
                    </div>
                    <div>
                        <p className='text-richblack-400'>Email</p>
                        <p className='text-richblack-200'>{user?.email}</p>
                    </div>
                    <div>
                        <p className='text-richblack-400'>Gender</p>
                        <p className='text-richblack-200'>
                            {user?.additionalDetails?.gender ?? "Add Gender"}
                        </p>
                    </div>
                    <div>
                        <p className='text-richblack-400'>Phone Number</p>
                        <p className='text-richblack-200'>
                            {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
                        </p>
                    </div>
                    <div>
                        <p className='text-richblack-400'>Date of Birth</p>
                        <p className='text-richblack-200'>
                            {user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
