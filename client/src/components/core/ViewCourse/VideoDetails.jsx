import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from '../../common/IconBtn';
import { FaSpinner } from 'react-icons/fa';

function VideoDetails() {
    const { token } = useSelector((state) => state.auth);
    const { courseId, sectionId, subSectionId } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const playerRef = useRef();
    const { courseSectionData, completedLectures } = useSelector((state) => state.viewCourse);
    const navigate = useNavigate();

    const [videoData, setVideoData] = useState(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const setVideoSpecificDetails = async () => {
            if (!courseSectionData.length) return;

            if (!courseId || !sectionId || !subSectionId) {
                navigate("/dashboard/enrolled-courses");
                return;
            }

            const filteredData = courseSectionData.filter(course => course._id === sectionId);
            const filteredVideoData = filteredData?.[0].subSection.filter(data => data._id === subSectionId);
            setVideoData(filteredVideoData[0] || null);
            setVideoEnded(false);
        };

        setVideoSpecificDetails();
    }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(data => data._id === subSectionId);
        return currentSubSectionIndex === 0 && currentSectionIndex === 0;
    };

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(data => data._id === subSectionId);
        return currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === courseSectionData[currentSectionIndex]?.subSection.length - 1;
    };

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const totalLectures = courseSectionData[currentSectionIndex]?.subSection.length || 0;
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subSectionId);

        if (currentSubSectionIndex !== totalLectures - 1) {
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        } else if (courseSectionData[currentSectionIndex + 1]) {
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    };

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex((subsection) => subsection._id === subSectionId);

        if (currentSubSectionIndex > 0) {
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        } else if (courseSectionData[currentSectionIndex - 1]) {
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        }
    };

    const handleLectureCompletion = async () => {
        setLoading(true);
        const res = await markLectureAsComplete({ courseId, subSectionId }, token);
        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-900 text-white p-5 rounded-lg shadow-lg relative">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <FaSpinner className="animate-spin text-3xl" />
                </div>
            ) : (
                <div>
                    {!videoData ? (
                        <div>No Data Found</div>
                    ) : (
                        <div className="relative">
                            <Player
                                ref={playerRef}
                                aspectRatio='16:9'
                                playsInline
                                onEnded={() => setVideoEnded(true)}
                                src={videoData.videoUrl}
                                className="mb-4"
                            />
                            {videoEnded && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                                    {!completedLectures.includes(subSectionId) && (
                                        <IconBtn
                                            disabled={loading}
                                            onclick={handleLectureCompletion}
                                            text={!loading ? "Mark As Completed" : "Loading..."}
                                            customClasses="mb-2 bg-yellow-500 text-black rounded-lg p-2 hover:bg-yellow-600 transition duration-200"
                                        />
                                    )}
                                    <IconBtn
                                        disabled={loading}
                                        onClick={() => {
                                            if (playerRef.current) {
                                                playerRef.current.seek(0);
                                                setVideoEnded(false);
                                            }
                                        }}
                                        text="Rewatch"
                                        customClasses="mb-2 bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition duration-200"
                                    />
                                    <div className="flex space-x-4">
                                        {!isFirstVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToPrevVideo}
                                                className='bg-gray-700 text-white rounded-lg p-2 hover:bg-gray-600 transition duration-200'
                                            >
                                                Prev
                                            </button>
                                        )}
                                        {!isLastVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToNextVideo}
                                                className='bg-gray-700 text-white rounded-lg p-2 hover:bg-gray-600 transition duration-200'
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoDetails;
