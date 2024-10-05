import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getEnrolledCourses as fetchEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';
import { BsClockFill } from "react-icons/bs";
import Footer from '../../common/Footer';

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


    console.log(course);
    course.courseContent.forEach(content => {
      content.subSection.forEach(subSec => {
          totalDuration += parseFloat(subSec.timeDuration); 
      });
  });

    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    return `${hours} H ${minutes} M`;
  };


  console.log(enrolledCourses)

  return (
    <>
    <div className='text-white flex flex-col items-center p-8'>
      <div className='text-4xl mb-6 justify-start'>Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className='text-lg'>Loading...</div>
      ) : !enrolledCourses.length ? (
        <p className='text-lg'>You have not enrolled in any course yet.</p>
      ) : (
        <div className='w-full max-w-full mx-auto'>
          <div className='grid grid-cols-3 gap-x-10 border-b border-gray-600 pb-4 mb-4 text-lg font-semibold'>
            <p>Course Name</p>
            <p>Duration</p>
            <p>Progress</p>
          </div>
          {enrolledCourses.map((course, index) => (
            <div key={index} className='grid grid-cols-3 gap-6 items-center mb-6 bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-richblack-600'
            onClick={() => navigate(`/course/${course._id}`)}
            
            >
              <div className='flex items-center space-x-4'>
                <img 
                  src={course.thumbnail} 
                  alt="Course Thumbnail" 
                  className='w-20 h-20 object-cover rounded-md'
                />
                <div>
                  <p className='text-xl font-semibold'>{course.courseName}</p>
                  <p className='text-sm text-gray-400'>{course.courseDescription}</p>
                </div>
              </div>

              <div className='text-center'>
                <p className='text-lg font-semibold flex flex-row gap-2'> <BsClockFill /> {calculateDuration(course)}   </p>
              </div>

              <div>
                <p className='text-lg font-semibold mb-2'>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height='10px'
                  bgColor='#34D399'
                  baseBgColor='#2D3748'
                  isLabelVisible={false}
                  className='rounded-full'
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default EnrolledCourses;
