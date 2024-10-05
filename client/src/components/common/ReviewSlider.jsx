import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { Autoplay, FreeMode } from 'swiper/modules';
import ReactStars from 'react-rating-stars-component';
import { apiConnector } from '../../services/apiconnector';
import { ratingsEndpoints } from '../../services/apis';
import { FaStar } from 'react-icons/fa';

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAllReviews = async () => {
      const { data } = await apiConnector('GET', ratingsEndpoints.REVIEWS_DETAILS_API);
      if (data?.success) {
        setReviews(data?.data);
      }
    };
    fetchAllReviews();
  }, []);

  return (
    <div className="text-white">
      <div className="h-[210px] max-w-maxContent ">
        <Swiper
          slidesPerView={3}  
          spaceBetween={90}   
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
          }}
          modules={[FreeMode, Autoplay]}
          className="w-full "
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="bg-richblack-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ">
              <div className="flex items-center mb-4">
                <img
                  src={
                    review?.user?.image
                      ? review?.user?.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt="Profile Pic"
                  className="h-16 w-16 object-cover rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-lg">{review?.user?.firstName} {review?.user?.lastName}</p>
                  <p className="text-sm text-gray-400">{review?.course?.courseName}</p>
                </div>
              </div>
              <p className="mb-4 text-md">{review?.review}</p>
              <div className="flex items-center justify-between">
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={24}  // Increased star size
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="font-medium text-lg">{review?.rating.toFixed(1)}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
