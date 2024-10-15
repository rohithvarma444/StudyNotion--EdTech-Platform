import React, { useState, useEffect } from 'react';
import { setCourseSectionData, setCompletedLectures, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import { Outlet } from 'react-router-dom';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSideBar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import { useParams } from 'react-router-dom';

const ViewCourse = () => {
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [reviewModal, setReviewModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            try {
                const courseData = await getFullDetailsOfCourse(courseId, token);
                dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
                dispatch(setEntireCourseData(courseData.courseDetails));
                dispatch(setCompletedLectures(courseData.completedVideos));
                let lectures = 0;
                courseData?.courseDetails?.courseContent?.forEach((sec) => {
                    lectures += sec.subSection.length;
                });
                dispatch(setTotalNoOfLectures(lectures));
            } catch (error) {
                // Handle error (e.g., show error message to user)
            } finally {
                setLoading(false);
            }
        };
        fetchCourseDetails();
    }, [courseId, token, dispatch]);

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </>
    );
};

export default ViewCourse;
