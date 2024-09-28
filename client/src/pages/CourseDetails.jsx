import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating';
import Error from './Error';
import RatingStars from '../components/common/RatingStars';
import { formattedDate } from '../utils/dateFormatter';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
import ConfirmationModal from '../components/common/ConfirmationModal';

function CourseDetails() {
    const { user } = useSelector((state) => state.profile);
    const { loading } = useSelector((state) => state.profile);
    const { paymentLoading } = useSelector((state) => state.course);
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

    useEffect(() => {
        const getCourseData = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                console.log("Printing course data:", result);
                setCourseData(result);
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };
        getCourseData();
    }, [courseId]);

    useEffect(() => {
        if (courseData?.data?.courseDetails?.ratingsAndReviews) {
            const count = GetAvgRating(courseData.data.courseDetails.ratingsAndReviews);
            setAvgReviewCount(count);
        }
    }, [courseData]);

    useEffect(() => {
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);


    const [isActive, setIsActive] = useState(Array(0));
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
             ? isActive.concat(id)
             : isActive.filter((e)=> e != id)

        )
    }

    const handleBuyCourse = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1: "You are not logged in",
            text2: "Please login to purchase the course",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    if (loading || !courseData) {
        return <div>Loading...</div>;
    }

    if (!courseData.success) {
        return <Error />;
    }

    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = courseData.data?.courseDetails;

    return (
        <div className="flex flex-col items-center">
            <div className="flex relative flex-col justify-start p-8">
                <p>{courseName}</p>
                <p>{courseDescription}</p>
                <div className="flex gap-x-2">
                    <span>{avgReviewCount}</span>
                    <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                    <span>{`(${ratingAndReviews.length} reviews)`}</span>
                    <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
                </div>

                <div>
                    <p>Created By {`${instructor.firstName}`}</p>
                </div>

                <div className="flex gap-x-3">
                    <p>Created At {formattedDate(createdAt)}</p>
                    <p>English</p>
                </div>

                <div>
                    <CourseDetailsCard
                        course={courseData?.data?.courseDetails}
                        setConfirmationModal={setConfirmationModal}
                        handleBuyCourse={handleBuyCourse}
                    />
                </div>
            </div>

            <div>
                <div>What you'll Learn</div>
                <div>{whatYouWillLearn}</div>
            </div>

            <div>
                <div>
                    <p>Course Content: </p>
                </div>
                <div className="flex gap-x-3 justify-between">
                    <div>
                        <span>{courseContent.length} section(s)</span>
                        <span>{totalNoOfLectures} lectures</span>
                        <span>{courseData.data?.totalDuration} total length</span>
                    </div>

                    <div>
                        <button onClick={() => setIsActive([])}>
                            Collapse all Sections
                        </button>
                    </div>
                </div>
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    );
}

export default CourseDetails;
