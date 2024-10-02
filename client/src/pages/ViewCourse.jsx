import React, { useState,useEffect } from 'react'
import { setCourseSectionData,setCompletedLectures,setEntireCourseData,setTotalNoOfLectures } from '../slices/viewCourseSlice'
import { useSelector,useDispatch } from 'react-redux';
import {getFullDetailsOfCourse} from "../services/operations/courseDetailsAPI"
import { Outlet } from 'react-router-dom';
import VideoDetailsSideBar from '../components/core/ViewCourse/VideoDetailsSideBar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import { useParams } from 'react-router-dom';


function ViewCourse() {
    //reviewModal
    //fetchinng the course details

    const [reviewModal, setReviewModal] = useState(false);
    const {courseId} = useParams();
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();


    useEffect(() => {
      const setCourseSpecificDetails = async () => {
        const courseData = await getFullDetailsOfCourse(courseId,token);
        if(courseData){
          dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
          dispatch(setEntireCourseData(courseData.courseDetails));
          dispatch(setCompletedLectures(courseData.completedVideos));
          let lectures = 0;
          courseData?.courseDetails?.courseContent?.forEach(
            (section) => {
              lectures += section.subSection.length
            }
          )
          dispatch(setTotalNoOfLectures(lectures))
        }
      }
      setCourseSpecificDetails();

    },[]);

    return (
    <>
      <div>
        <VideoDetailsSideBar reviewModal={setReviewModal} />

        <div>
          <Outlet />
        </div>
      </div>
      {
        reviewModal && 
         < CourseReviewModal setReviewModal={setReviewModal} />
      }
    </>
  )
}

export default ViewCourse