import React from 'react'
import { useSelector } from 'react-redux'
import CourseBuilderForm from './CourseBuilder/CourseBuilderForm'
import CourseInformationForm from './CourseInformation/CourseInformationForm'
import { FaCheck } from 'react-icons/fa'


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
      <div>
        {steps.map((items) => (
          <div key={items.id}>
            <div
              className={`${
                step === items.id
                  ? "bg-yellow-900 border-yellow-50 text-yellow-50"
                  : "border-richblack-700 bg-richblack-800 text-richblack-300"
              }`}
            >
              {step > items.id ? <FaCheck /> : items.id}
            </div>
          </div>
        ))}
      </div>

      <div>
        {steps.map((item) => (
          <div key={item.id}>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
    </>
  )
}

export default RenderSteps