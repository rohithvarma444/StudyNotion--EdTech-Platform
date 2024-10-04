import React, { useState, useEffect } from 'react';
import { setCourseSectionData, setCompletedLectures, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import { Outlet } from 'react-router-dom';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSideBar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import { useParams } from 'react-router-dom';

function ViewCourse() {
    const [reviewModal, setReviewModal] = useState(false);
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            if (courseData) {
                dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
                dispatch(setEntireCourseData(courseData.courseDetails));
                dispatch(setCompletedLectures(courseData.completedVideos));
                let lectures = 0;
                courseData?.courseDetails?.courseContent?.forEach((section) => {
                    lectures += section.subSection.length;
                });
                dispatch(setTotalNoOfLectures(lectures));
            }
        };
        setCourseSpecificDetails();
    }, [courseId, token, dispatch]);

    return (
        <div className="flex">
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
            <div className="flex-grow p-4">
                <Outlet />
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </div>
    );
}

export default ViewCourse;
