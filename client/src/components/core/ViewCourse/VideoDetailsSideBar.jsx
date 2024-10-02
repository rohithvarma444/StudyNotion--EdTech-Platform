import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IconBtn from '../../common/IconBtn';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

function VideoDetailsSideBar({ setReviewModal }) {
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
        if (!courseSectionData.length) {
            return;
        }
        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
            (data) => data._id === subSectionId
        );

        setActiveStatus(currentSectionIndex);
        setVideoBarActive(currentSubSectionIndex);
    }, [courseEntireData, courseSectionData, location.pathname]);

    return (
        <>
            <div>
                <div>
                    <div onClick={() => navigate("/dashboard/enrolled-courses")}>
                        Back
                    </div>

                    <div>
                        <IconBtn 
                            text="Add Review"
                            onclick={() => setReviewModal(true)}
                        />
                    </div>
                </div>

                <div>
                    <p>{courseEntireData?.courseName}</p>
                    <p>
                        {completedLectures?.length} / {totalNoOfLectures}
                    </p>
                </div>
            </div>

            <div>
                {courseSectionData.map((course, index) => (
                    <div
                        onClick={() => setActiveStatus(course?._id)}
                        key={index}
                    >
                        <div>
                            <div>
                                {course?.SectionName}
                            </div>
                            <MdOutlineKeyboardArrowDown />
                        </div>

                        {activeStatus === course?._id && (
                            <div>
                                {course.subSection.map((topic, index) => (
                                    <div
                                        className={`flex gap-5 p-5 ${
                                            videoBarActive === topic._id
                                                ? "bg-yellow-200 text-richblack-900"
                                                : "bg-richblack-900 text-white"
                                        }`}
                                        onClick={() => {
                                            navigate(
                                                `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                                            );
                                            setVideoBarActive(topic?._id);
                                        }}
                                    >
                                        <input 
                                            type="checkbox"
                                            checked={completedLectures.includes(topic?._id)}
                                        />
                                        <span>
                                            {topic.tile}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default VideoDetailsSideBar;
