import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { Player } from 'video-react';
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from '../../common/IconBtn';

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
        console.log("Logging in here handleLectureCompletion");
        const res = await markLectureAsComplete({ courseId, subSectionId }, token);
        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {!videoData ? (
                        <div>No Data Found</div>
                    ) : (
                        <Player
                            ref={playerRef}
                            aspectRatio='16:9'
                            playsInline
                            onEnded={() => setVideoEnded(true)}
                            src={videoData.videoUrl}
                        >
                            <AiFillPlayCircle />
                            {videoEnded && (
                                <div>
                                    {!completedLectures.includes(subSectionId) && (
                                        <IconBtn
                                            disabled={loading}
                                            onclick={handleLectureCompletion}
                                            text={!loading ? "Mark As Completed" : "Loading..."}
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
                                    <div>
                                        {!isFirstVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToPrevVideo}
                                                className='blackButton'
                                            >
                                                Prev
                                            </button>
                                        )}
                                        {!isLastVideo() && (
                                            <button
                                                disabled={loading}
                                                onClick={goToNextVideo}
                                                className='blackButton'
                                            >
                                                Next
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Player>
                    )}
                </div>
            )}
        </div>
    );
}

export default VideoDetails;
