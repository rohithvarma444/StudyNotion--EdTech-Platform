import React from 'react'
import InstructorImage from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "./Button"
import { FaArrowRight } from 'react-icons/fa'

function InstructorSection() {
  return (
    <div className='flex flex-row gap-20 items-center mt-16'>

        <div className='w-[50%]'>

            <img src={InstructorImage} alt="not found" />

        </div>


        <div className='w-[50%] flex flex-col gap-10 items-start'>

            <div className='text-4xl font-semibold'>
                Become an 
                <HighlightText text={"An Instructor"}/>
            </div>


            <p className='font-medium text-[16px] text-richblack-300'>
                Instructors from around the world teach millions of students on StudyNotion. We provide tools and skills to teach what you love.
            </p>

            <CTAButton active={true} linkto={"/signup"}>
                <div className='font-semibold flex flex-row items-center gap-1 '>
                    <div className='font-semibold text-[16px]'>Learn More</div>
                    <div><FaArrowRight/></div>
                </div>
            </CTAButton>

        </div>

    </div>
  )
}

export default InstructorSection