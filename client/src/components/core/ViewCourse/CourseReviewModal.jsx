import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { createRating } from '../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import ReactStars from 'react-rating-stars-component';
import IconBtn from '../../common/IconBtn';

function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    setValue('courseExperience', '');
    setValue('courseRating', 0);
  }, [setValue]);

  const ratingChanged = (newRating) => {
    setValue('courseRating', newRating);
  };

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
        <div className="bg-richblack-800 p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Add Review</h2>
            <button onClick={() => setReviewModal(false)}>
              <MdClose className="text-white" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-4">
            <img
              src={user.image}
              alt="user-image"
              className="w-16 h-16 rounded-full mb-2"
            />
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
              className="mb-4"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div>
              <label htmlFor="courseExperience" className="text-white">
                Add Your Experience*
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Experience here"
                {...register('courseExperience', { required: true })}
                className="form-style min-h-[130px] w-full mt-2 p-2 border border-gray-300 rounded"
              />
              {errors.courseExperience && (
                <span className="text-red-500">
                  Please add your experience
                </span>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className=" text-white py-2 px-4 rounded hover:bg-yellow-300"
              >
                Cancel
              </button>
              <IconBtn
                text="Save"
                customClasses="bg-yellow-50 text-black py-2 px-4 rounded hover:bg-yellow-300"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CourseReviewModal;
