import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import { VscAdd } from 'react-icons/vsc';
import CourseTable from './CoursesTable'; // Assuming you have a CourseTable component

function MyCourses() {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true); 

    // Fetch the courses using the token
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const result = await fetchInstructorCourses(token);
                if (result) {
                    setCourses(result);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            }
            setLoading(false); 
        };
        fetchCourses();
    }, []);
    return (
        <div className="mb-14 text-white items-center justify-center mx-auto p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5 mb-10 mt-10">My Courses</h1>
                <IconBtn
                    text="Add Course"
                    onclick={() => navigate("/dashboard/add-course")}
                    customClasses={'flex flex-row gap-x-2 text-black bg-yellow-100 p-2 rounded-lg'}
                >
                    <VscAdd className='mt-1'/>
                </IconBtn>
            </div>

            {loading ? (
                <p>Loading...</p> 
            ) : courses && courses.length > 0 ? (
                <CourseTable courses={courses} setCourses={setCourses} />
            ) : (
                <p>No courses found.</p> 
            )}
        </div>
    );
}

export default MyCourses;
