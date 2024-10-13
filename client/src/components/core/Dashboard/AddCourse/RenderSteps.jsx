import React from 'react'
import { useSelector } from 'react-redux'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'
import CourseInformationForm from './CourseInformation/CourseInformationForm'
import { FaCheck } from 'react-icons/fa'
import PublishCourse from './Publish/index'


function RenderSteps() {

  const { step } = useSelector((state) => state.course)

  const steps = [
    {
      id: 1,
      title: "Course Information"
    },
    {
      id: 2,
      title: "Course Builder"
    },
    {
      id: 3,
      title: "Publish"
    },
  ]



  return (
    <>
      <div className='flex justify-between mr-10'>
        {steps.map((item) => (
          <div key={item.id} className='flex flex-col items-center'>
            <div
              className={`${
                step === item.id
                  ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                  : "border-richblack-700 bg-richblack-800 text-richblack-300"
              } rounded-full w-10 h-10 flex items-center justify-center border border-richblack-700 mb-2`}
            >
              {step > item.id ? <FaCheck /> : item.id}
            </div>
            <p className={`text-center ${step === item.id ? "text-yellow-50" : "text-richblack-300"}`}>
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse/>}
    </>
  )
}

export default RenderSteps
