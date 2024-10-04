import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSidebar = ({ setReviewModal }) => {
    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { sectionId, subSectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        const setActiveFlags = () => {
            if (!courseSectionData.length) return;
            const currentSectionIndex = courseSectionData.findIndex(
                (data) => data._id === sectionId
            );
            const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
                (data) => data._id === subSectionId
            );
            const activeSubSectionId = courseSectionData[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            setVideoBarActive(activeSubSectionId);
        };
        setActiveFlags();
    }, [courseSectionData, location.pathname]);

    const handleAddReview = () => {
        setReviewModal(true);
    };

    return (
        <div className="bg-gray-800 text-white w-full md:w-1/4 p-4 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <div
                    className="cursor-pointer text-lg font-semibold hover:text-yellow-300"
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                >
                    Back
                </div>
                <IconBtn text="Add Review" onclick={handleAddReview} />
            </div>
            <div className="mb-4">
                <p className="text-lg font-semibold">{courseEntireData?.courseName}</p>
                <p>{completedLectures.length} / {totalNoOfLectures}</p>
            </div>
            <div>
                {courseSectionData.map((course, index) => (
                    <div key={index} className="mb-2">
                        <div
                            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
                            onClick={() => setActiveStatus(course?._id)}
                        >
                            <div className="font-medium">{course?.sectionName}</div>
                        </div>
                        {activeStatus === course?._id && (
                            <div className="ml-4">
                                {course.subSection.map((topic, index) => (
                                    <div
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                                            videoBarActive === topic._id
                                                ? "bg-yellow-500 text-black"
                                                : "bg-gray-900 text-white"
                                        }`}
                                        key={index}
                                        onClick={() => {
                                            navigate(`/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`);
                                            setVideoBarActive(topic?._id);
                                        }}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={completedLectures.includes(topic?._id)}
                                            readOnly
                                            className="accent-yellow-500"
                                        />
                                        <span>{topic.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoDetailsSidebar;
