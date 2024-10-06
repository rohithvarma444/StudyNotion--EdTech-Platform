import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

function Instructor() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const [courses, setCourses] = useState([]);
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getCourseDataWithStats = async () => {
            setLoading(true);

            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            console.log("This is Instructor: ", instructorApiData);

            if (instructorApiData.length) {
                setInstructorData(instructorApiData);
            }
            if (result) {
                setCourses(result);
            }
            setLoading(false);
        };
        getCourseDataWithStats();
    }, [token]);

    const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0);

    return (
        <div className='text-white p-2 flex flex-col gap-y-5'>
            <div className='p-3'>
                <h1 className='text-2xl'>Hi {user?.firstName}</h1>
                <p className='text-richblack-100'>Let's start something new</p>
            </div>

            {loading ? (
                <div className='spinner'></div>
            ) : courses.length > 0 ? (
                <div>
                    <div className='flex flex-row gap-x-5 w-full'>
                        <InstructorChart courses={instructorData} />
                        <div className="ml-10 p-5 bg-gray-800 rounded-lg shadow-lg bg-richblack-700 p-6 w-5/12">
                            <h2 className="text-2xl font-bold text-white mb-4">Statistics</h2>
                            <div className="flex flex-col gap-5">
                                <div className="bg-richblack-900 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 w-full">
                                    <p className="text-gray-400">Total Courses</p>
                                    <p className="text-3xl font-semibold text-white">{courses.length}</p>
                                </div>
                                <div className="bg-richblack-900 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <p className="text-gray-400">Total Students</p>
                                    <p className="text-3xl font-semibold text-white">{totalStudents}</p>
                                </div>
                                <div className="bg-richblack-900 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <p className="text-gray-400">Total Income</p>
                                    <p className="text-3xl font-semibold text-white">Rs. {totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 bg-richblack-700 rounded-lg shadow-lg mt-5">
                        <h2 className="text-2xl font-bold text-white mb-4">Your Courses</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.slice(0, 3).map((course) => (
                                <div key={course.id} className=" p-5 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <img 
                                        src={course.thumbnail} 
                                        alt={course.courseName} 
                                        className="w-full h-32 object-cover rounded-md mb-3" 
                                    />
                                    <h3 className="text-lg font-semibold text-white">{course.courseName}</h3>
                                    <div className="flex justify-between text-gray-400">
                                        <p>{course.studentsEnrolled.length} students</p>
                                        <p>Rs {course.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link 
                            to="/dashboard/my-courses" 
                            className="mt-4 inline-block text-blue-400 font-semibold hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                </div>
            ) : (
                <div>
                    <p>You have not created any courses yet</p>
                    <Link to={"/dashboard/addCourse"}>
                        Create a Course
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Instructor;
