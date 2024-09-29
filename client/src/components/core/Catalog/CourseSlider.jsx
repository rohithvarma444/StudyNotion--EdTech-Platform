import React from 'react';
import CourseCard from './CourseCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

function CourseSlider({ Courses }) {
  console.log("In Course Slider: ",Courses)
  return (
    <div>
      {Courses && Courses.length ? (
        <Swiper
          slidesPerView={1}
          loop={true}
          spaceBetween={200}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          navigation={true}
          breakpoints={{
            1024: { slidesPerView: 3 },
          }}
        >
          {Courses?.map((course, index) => (
            <SwiperSlide key={index}>
              <CourseCard course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>No course here</p>
      )}
    </div>
  );
}

export default CourseSlider;
