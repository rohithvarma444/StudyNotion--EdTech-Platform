import React from 'react'
import HighlightText from "../components/core/HomePage/HighlightText"
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from '../components/core/AboutPage/Quote';
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/StatsComponent';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from '../components/core/ContactPage/ContactFormSection';
import Footer from '../components/common/Footer';
import  ReviewSlider from '../components/common/ReviewSlider';

function About() {
  return (
    <div className='text-white mt-15 '>
        <div className='bg-richblack-800'>
        <section className='mx-auto mb-15 items-center justify-center p-10'>
            <div>
                <p className='mx-auto text-center text-underline text-richblack-500' >About Us</p>
                <header className='text-center justify-center items-center text-4xl font-semibold mt-4'>
                    Driving Innovation in Online Education for a 
                    <HighlightText text={"Bright Future"} />
                    <p className='text-lg font-medium text-richblack-300 w-[80%] mx-auto justify-center items-center mt-5' >StudyNotion is at the forefront of driving innovation in online education.We're passionate about creating a brighter future by offering cutting edge courses,leveraging emerging technologies, and nuturing a vibrantl learning community.</p>
                </header>
                <div className='flex flex-row items-center gap-5 justify-between w-[70%] mx-auto mt-5 h-[400px]'>
                    <img src={BannerImage1} alt="not found" />
                    <img src={BannerImage2} alt="not found" />
                    <img src={BannerImage3} alt="not found" />
                </div>
            </div>
        </section>
        </div>



        <section className='text-4xl w-[75%] mx-auto mt-10 '>
            <div>
                <Quote/>
            </div>
        </section>


        <div className='w-10/12 justify-center items-center mx-auto h-[1px] bg-richblack-700 my-10 '></div>



        <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-y-5 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
              Our Mission
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
              Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>




      <section className='mx-auto mb-15'>
        <StatsComponent />
      </section>

      <section className='flex mx-auto mt-10 items-center justify-between flex-col gap-5' >
        <LearningGrid />
        <ContactFormSection />
      </section>

      <div className='mx-auto  items-center justify-center mt-10 mb-10'>
        <ReviewSlider />
      </div>

      <Footer />
    </div>
  )
}

export default About
