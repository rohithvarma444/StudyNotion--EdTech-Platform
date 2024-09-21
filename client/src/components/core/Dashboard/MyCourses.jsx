import React, { useEffect, useState } from 'react';
import { CiCirclePlus } from "react-icons/ci";
import { getInstructorCourses } from '../../../services/operations/profileAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../slices/authSlice';
import { MdDelete, MdEdit } from "react-icons/md";

function MyCourses() {
    const [myCourses, setMyCourses] = useState(null);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const fetchInstructorCourses = async () => {
        if (!token) return;

        dispatch(setLoading(true));
        const courses = await getInstructorCourses(token);
        setMyCourses(courses);
        dispatch(setLoading(false));
    };

    useEffect(()=> {
        fetchInstructorCourses();
    },[token])

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Courses</h1>
                <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md">
                    <CiCirclePlus className="mr-2" />
                    New Course
                </button>
            </div>

            {!myCourses ? (
                <div className="text-lg">Loading...</div>
            ) : myCourses.length === 0 ? (
                <p className="text-lg">You have not created any courses yet.</p>
            ) : (
                <div className="w-full max-w-4xl">
                    <div className="grid grid-cols-3 gap-6 border-b border-gray-600 pb-4 mb-4 text-lg font-semibold">
                        <p>Course Name</p>
                        <p>Duration</p>
                        <p>Price</p>
                    </div>
                    {myCourses.map((course, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-3 gap-6 items-center mb-6 bg-gray-800 p-4 rounded-lg shadow-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <img
                                    src={course.thumbnail}
                                    alt="Course Thumbnail"
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                                <div>
                                    <p className="text-xl font-semibold">
                                        {course.courseName}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {course.courseDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-lg font-semibold">
                                    {course.totalDuration}
                                </p>
                            </div>

                            <div className="text-center">
                                <p>{course.price}</p>
                            </div>

                            <div className="flex space-x-2">
                                <MdDelete className="cursor-pointer text-red-500" />
                                <MdEdit className="cursor-pointer text-blue-500" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyCourses;
