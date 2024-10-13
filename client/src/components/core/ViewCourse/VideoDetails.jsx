import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import IconBtn from '../../common/IconBtn';
import { FaSpinner } from 'react-icons/fa';

function VideoDetails() {
    const { token } = useSelector((state) => state.auth);
    const { courseId, sectionId, subSectionId } = useParams();
    const dispatch = useDispatch();
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
        <div className="flex flex-col space-y-4 text-white">
            {loading ? (
                <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                    <FaSpinner className="animate-spin text-3xl text-yellow-50" />
                </div>
            ) : (
                <>
                    {!videoData ? (
                        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                            No Video Data Found
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-semibold">{videoData.title}</h1>
                            <div className="relative aspect-video">
                                <Player
                                    ref={playerRef}
                                    aspectRatio="16:9"
                                    playsInline
                                    onEnded={() => setVideoEnded(true)}
                                    src={videoData.videoUrl}
                                />
                                {videoEnded && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-richblack-900 bg-opacity-90">
                                        <div className="flex flex-col items-center space-y-4">
                                            {!completedLectures.includes(subSectionId) && (
                                                <IconBtn
                                                    disabled={loading}
                                                    onclick={handleLectureCompletion}
                                                    text={loading ? "Loading..." : "Mark As Completed"}
                                                    customClasses="text-xl"
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
                                                customClasses="text-xl"
                                            />
                                            <div className="flex space-x-4">
                                                {!isFirstVideo() && (
                                                    <button
                                                        disabled={loading}
                                                        onClick={goToPrevVideo}
                                                        className='bg-richblack-800 text-richblack-25 px-4 py-2 rounded-md hover:bg-richblack-700 transition-all duration-200'
                                                    >
                                                        Prev
                                                    </button>
                                                )}
                                                {!isLastVideo() && (
                                                    <button
                                                        disabled={loading}
                                                        onClick={goToNextVideo}
                                                        className='bg-yellow-50 text-richblack-900 px-4 py-2 rounded-md hover:bg-yellow-100 transition-all duration-200'
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-semibold mt-4">Description:</h2>
                            <p className="text-richblack-50">{videoData.description}</p>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default VideoDetails;
