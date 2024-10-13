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
import CourseAccordionBar from "../components/core/Course/CourseAccordianBar";
import Footer from "../components/common/Footer";

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
                setCourseData(result[0]);
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };
        getCourseData();
    }, [courseId]);

    useEffect(() => {
        if (courseData?.ratingsAndReviews) {
            const count = GetAvgRating(courseData.data.courseDetails.ratingsAndReviews);
            setAvgReviewCount(count);
        }
    }, [courseData]);

    useEffect(() => {
        let lectures = 0;
        courseData?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);

    const [isActive, setIsActive] = useState([]);
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
                ? [...isActive, id]
                : isActive.filter((e) => e !== id)
        );
    };

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
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }

    if (!courseData) {
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
    } = courseData;

    return (
        <div className="flex flex-col items-center text-white p-4 w-full">
            <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
                {/* Course Info Section */}
                <div className="flex-1 p-8">
                    <p className="text-2xl font-semibold">{courseName}</p>
                    <p className="text-lg mb-4">{courseDescription}</p>
                    <div className="flex gap-x-2 mb-4">
                        <span className="text-yellow-25">{avgReviewCount}</span>
                        <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                        <span>{`(${ratingAndReviews.length} reviews)`}</span>
                        <span>{`(${studentsEnrolled.length} students enrolled)`}</span>
                    </div>
                    <div className="mb-2">
                        <p><span className='font-bold'>Created By</span> {`${instructor.firstName} ${instructor.lastName}`}</p>
                    </div>
                    <div className="flex gap-x-3 mb-4">
                        <p><span className='font-bold'>Created At</span> {formattedDate(createdAt)}</p>
                        <p>English</p>
                    </div>
                    <div className="mb-8 border-dotted border-4 p-3">
                        <p className="text-lg font-semibold">What you'll Learn</p>
                        <div className="text-md">{whatYouWillLearn}</div>
                    </div>
                    <div className="mb-8">
                        <p className="text-lg font-semibold">Course Content:</p>
                        <div className="flex gap-x-3 justify-between mb-4">
                            <div>
                                <span>{courseContent.length} section(s)</span>
                                <span>{totalNoOfLectures} lectures</span>
                                <span>{courseData?.totalDuration} total length</span>
                            </div>
                            <div>
                                <button className="text-yellow-25" onClick={() => setIsActive([])}>
                                    Collapse all Sections
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Course Details Accordion */}
                    <div className="py-4">
                       
                            <CourseAccordionBar
                                course={courseData}
                                isActive={isActive}
                                handleActive={handleActive}
                            />
                    </div>
                </div>

                {/* Course Details Card */}
                <div className="w-full lg:w-1/3 p-4 lg:p-8">
                    <CourseDetailsCard
                        course={courseData}
                        setConfirmationModal={setConfirmationModal}
                        handleBuyCourse={handleBuyCourse}
                    />
                </div>
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4 w-full max-w-7xl mx-auto">
                <p className="text-[28px] font-semibold">Author</p>
                <div className="flex items-center gap-4 py-4">
                    <img
                        src={
                            instructor.image
                                ? instructor.image
                                : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                        }
                        alt="Author"
                        className="h-14 w-14 rounded-full object-cover"
                    />
                    <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
                </div>
                <p className="text-richblack-50">
                    {instructor?.additionalDetails?.about}
                </p>


                
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
            
            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}

export default CourseDetails;
