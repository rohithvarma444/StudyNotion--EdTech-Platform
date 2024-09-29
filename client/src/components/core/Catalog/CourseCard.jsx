import React from 'react'
import { Link } from 'react-router-dom';
import { useEffect,useState } from 'react';
import GetAvgRating from '../../../utils/avgRating';
import RatingStars from '../../common/RatingStars';



function CourseCard({course,Height}) {

  console.log("In CourseCard:  ",course)
  const [avgReviewCount,setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course.ratingsAndReviews);
    setAvgReviewCount(count);
  },[course])
  return (
    <div>
      <Link>
        <div>
          <div>
            <img src={course?.thumbnail} alt="Course Thumbnail" className={`${Height} rounded-xl object-cover w-full`}/>
          </div>
          <div>
            <p>{course?.courseName}</p>
            <p>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
            <div>
              <span>{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span>{course?.ratingAndReviews?.length}Ratings</span>
            </div>
            <p>{course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CourseCard