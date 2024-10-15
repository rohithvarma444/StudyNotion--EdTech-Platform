import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import copy from 'copy-to-clipboard';
import { FaShareFromSquare } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { thumbnail: ThumbnailImage, price: CurrentPrice, instructions } = course;

    const handleAddToCart = () => {
        try {
            if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
                toast.error("You are an Instructor, you cannot buy a course");
                return;
            }

            if (token) {
                dispatch(addToCart(course));
                toast.success("Course added to cart");
                return;
            }

            // If not logged in, show confirmation modal
            setConfirmationModal({
                text1: "You are not logged in",
                text2: "Please login to add to cart",
                btn1Text: "Login",
                btn2Text: "Cancel",
                btn1Handler: () => navigate("/login"),
                btn2Handler: () => setConfirmationModal(null),
            });
        } catch (error) {
            toast.error("An error occurred while adding the course to cart");
            console.error("Add to cart error:", error);
        }
    };

    const handleShare = () => {
        try {
            copy(window.location.href);
            toast.success("Link copied to clipboard successfully");
        } catch (error) {
            toast.error("Failed to copy link to clipboard");
            console.error("Share error:", error);
        }
    };


    return (
        <div className='p-4 bg-richblack-700 rounded-lg flex flex-col gap-3'>
            <img
                src={ThumbnailImage}
                alt="Thumbnail Image"
                className="w-full object-cover rounded-lg"
            />

            <div className='text-2xl font-semibold'>Rs. {CurrentPrice}</div>

            <div className="flex flex-col gap-y-2">
                <button
                    className="w-full py-2 text-black font-bold bg-yellow-300 rounded-md"
                    onClick={
                        user && course?.studentsEnrolled.includes(user?._id)
                            ? () => navigate(`/view-course/${course._id}/section/${course.courseContent[0]._id}/sub-section/${course.courseContent[0].subSection[0]._id}`)
                            : handleBuyCourse
                    }
                >
                    {user && Array.isArray(course?.studentsEnrolled) && course.studentsEnrolled.includes(user._id)
                        ? "Go to Course"
                        : "Buy Course"}
                </button>

                {!course.studentsEnrolled?.includes(user?._id) && (
                    <button
                        className='w-full py-2 font-bold bg-richblack-900 rounded-md'
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>

            <div>
                <h1 className='font-semibold'>Course Requirements :</h1>
                <div className='flex flex-col gap-1'>
                    {instructions?.map((item, ind) => (
                        <div key={ind} className='flex gap-2 text-[#46ae46] items-center text-[14px]'>
                            <FaArrowRightLong size={14} />
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type='button'
                className='flex gap-1 text-yellow-300 items-center font-bold justify-center'
                onClick={handleShare}
            >
                <FaShareFromSquare size={15} />
                <p>Share</p>
            </button>
        </div>
    );
}

export default CourseDetailsCard;
