import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getEnrolledCourses as fetchEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';
import { BsClockFill } from "react-icons/bs";

function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate();

  const loadEnrolledCourses = async () => {
    try {
      const response = await fetchEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("Error loading the courses", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadEnrolledCourses();
    }
  }, [token]);



  const calculateDuration = (course) => {
    let totalDuration = 0;


    course.courseContent.forEach(content => {
      content.subSection.forEach(subSec => {
          totalDuration += parseFloat(subSec.timeDuration); 
      });
  });

    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    return `${hours} H ${minutes} M`;
  };



  return (
    <div className='text-white w-10/12 mx-auto justify-center items-center'>
      <h1 className='text-3xl font-medium mb-6 mt-10'>Enrolled Courses</h1>
      {!enrolledCourses ? (
        <div className='text-lg'>Loading...</div>
      ) : !enrolledCourses.length ? (
        <p className='text-lg'>You have not enrolled in any course yet.</p>
      ) : (
        <div className='my-8'>
          <div className='flex text-sm text-richblack-50'>
            <p className='w-[45%]'>Course Name</p>
            <p className='w-1/4 text-center'>Duration</p>
            <p className='flex-1 text-center'>Progress</p>
          </div>
          {enrolledCourses.map((course, index) => (
            <div 
              key={index} 
              className='flex items-center border border-richblack-700 bg-richblack-800 p-4 my-4 rounded-lg cursor-pointer hover:bg-richblack-700 transition-all duration-200'
              onClick={() => navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)}
            >
              <div className='flex w-[45%] items-center gap-4'>
                <img 
                  src={course.thumbnail} 
                  alt="Course Thumbnail" 
                  className='h-14 w-14 rounded-lg object-cover'
                />
                <div className='flex flex-col gap-2'>
                  <p className='font-semibold'>{course.courseName}</p>
                  <p className='text-xs text-richblack-300'>{course.courseDescription.split(" ").slice(0, 5).join(" ") + "..."}</p>
                </div>
              </div>

              <div className='w-1/4 text-center'>
                <p className='text-sm font-medium flex justify-center items-center gap-2'>
                  <BsClockFill />
                  {calculateDuration(course)}
                </p>
              </div>

              <div className='flex-1'>
                <p className='text-sm font-medium text-center mb-2'>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height='8px'
                  isLabelVisible={false}
                  bgColor='#17a34a'
                  baseBgColor='#2C333F'
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCourses;
