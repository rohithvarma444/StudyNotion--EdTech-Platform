import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../slices/cartSlice';
import copy from 'copy-to-clipboard';

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { thumbnail: ThumbnailImage, price: CurrentPrice } = course;

    const handleAddToCart = () => {
        try {
            if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
                toast.error("You are an Instructor, you cannot buy a course");
                return;
            }

            if (token) {
                console.log("Dispatching add to cart");
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
        <div>
            <img
                src={ThumbnailImage}
                alt="Thumbnail Image"
                className="max-h-[300px] min-h-[180px] w-[400px] rounded-xl"
            />

            <div>Rs. {CurrentPrice}</div>

            <div className="flex flex-col gap-y-2">
                <button
                    className="bg-yellow-50 w-fit text-richblack-900"
                    onClick={
                        user && course?.studentEnrolled.includes(user?._id)
                            ? () => navigate("/dashboard/enrolled-courses")
                            : handleBuyCourse
                    }
                >
                    {user && course?.studentEnrolled.includes(user?._id)
                        ? "Go to Course"
                        : "Buy Course"}
                </button>

                {!course?.studentEnrolled.includes(user?._id) && (
                    <button
                        className="bg-yellow-50 w-fit text-richblack-900"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                )}
            </div>

            <div>
                <button
                    className="mx-auto items-center gap-2 p-6 text-yellow-50"
                    onClick={handleShare}
                >
                    Share
                </button>
            </div>
        </div>
    );
}

export default CourseDetailsCard;
