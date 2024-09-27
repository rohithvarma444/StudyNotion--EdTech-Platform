import React,{useState,useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { useSelector,useDispatch } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { setStep,resetCourseState } from '../../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { editCourseDetails } from '../../../../../services/operations/courseDetailsAPI';

function PublishCourse() {
    const { token } = useSelector((state) => state.auth);
    const { course } = useSelector((state) => state.course);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { 
        register, 
        formState: { errors }, 
        handleSubmit, 
        getValues 
    } = useForm({
        defaultValues: {
            public: course?.status === COURSE_STATUS.PUBLISHED,
        },
    });

    const goToCourses = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    };

    const handleCoursePublish = async () => {
        if (
            (course?.status === COURSE_STATUS.PUBLISHED && getValues("public")) ||
            (course?.status === COURSE_STATUS.DRAFT && !getValues("public"))
        ) {
            goToCourses();
            return;
        }

        const formData = new FormData();
        formData.append("courseId", course._id);
        const courseStatus = getValues("public")
            ? COURSE_STATUS.PUBLISHED
            : COURSE_STATUS.DRAFT;
        formData.append("status", courseStatus);

        try {
            setLoading(true);
            const result = await editCourseDetails(formData, token);
            if (!result) throw new Error("Failed to publish the course");
            goToCourses();
        } catch (error) {
            toast.error(error.message || "Failed to publish the course");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        handleCoursePublish();
    };

    const goBack = () => {
        dispatch(setStep(2));
    };

    return (
        <div className="flex justify-center p-9 bg-richblack-600">
            <div className="w-[500px] rounded-lg bg-richblack-800 p-6 shadow-lg">
                <h1 className="text-2xl font-semibold text-richblack-5 mb-4">
                    Publish Settings
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center justify-start gap-2">
                        <label
                            htmlFor="public"
                            className="text-sm font-medium text-richblack-200"
                            title="Select to make the course visible to everyone"
                        >
                            Make it public?
                        </label>
                        <input
                            type="checkbox"
                            id="public"
                            {...register("public", { required: true })}
                            className="h-5 w-5 rounded border-richblack-300 text-yellow-500 focus:ring-2 focus:ring-yellow-500"
                            disabled={loading}
                        />
                    </div>
                    {errors.public && (
                        <span className="text-xs text-pink-200">
                            Please confirm if you want to make it public
                        </span>
                    )}
                    <div className="flex justify-end items-center mt-4 gap-4">
                        <button
                            type="button"
                            className="underline text-richblack-200 hover:text-yellow-500 transition-colors"
                            onClick={goBack}
                        >
                            Back
                        </button>
                        <IconBtn text={loading ? "Publishing..." : "Publish"} type="submit" disabled={loading} customClasses="bg-yellow-50 text-semibold p-2 rounded-md text-black" />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PublishCourse;





//handle the form for submission with the checkbox 
//handle the onsubmit buttons 
//handle the goback button