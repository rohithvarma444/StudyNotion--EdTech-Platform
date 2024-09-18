import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from 'react-stars';
import { GiRoundStar } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { removeFromCart } from '../../../../slices/cartSlice';

function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Dummy function for rating change
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  return (
    <div>
      {cart.map((course, index) => (
        <div key={course._id} className='flex flex-row gap-x-2 items-center border-b border-gray-700 pb-4 mb-4'>
          {/* Thumbnail */}
          <div>
            <img src={course?.thumbnail} alt="Course Thumbnail" className='w-20 h-20 rounded' />
          </div>

          {/* Course Details */}
          <div className='flex flex-col gap-2 flex-grow'>
            <p className='font-semibold text-lg'>{course?.courseName}</p>
            <p className='text-sm text-gray-400'>{course?.category?.name}</p>

            {/* Rating Section */}
            <div className='flex items-center gap-1'>
              <span className='font-semibold'>4.8</span> {/* Replace with dynamic value */}
              <ReactStars
                count={5}
                value={4.8}  // Replace with dynamic rating if available
                onChange={ratingChanged}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<GiRoundStar />}
                fullIcon={<GiRoundStar />}
              />
              <span className='text-sm text-gray-500'>({course?.ratingsAndReviews?.length} Ratings)</span>
            </div>
          </div>

          {/* Delete Button */}
          <div>
            <button
              onClick={() => dispatch(removeFromCart(course._id))}
              className='text-red-500 hover:text-red-700 flex items-center gap-x-2'
            >
              <MdDelete />
              <span>Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RenderCartCourses;
