import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

const Quote = () => {
  return (
    <div className="text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white relative ">
      <div className="flex flex-col">
        <FaQuoteLeft className='text-4xl self-start mb-2 text-richblack-500' />
        <p>
          We are passionate about revolutionizing the way we learn. Our
          innovative platform <HighlightText text={"combines technology"} />,{" "}
          <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">
              expertise
          </span>
          , and community to create an
          <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
              {" "}
              unparalleled educational experience.
          </span>
        </p>
        <FaQuoteRight className='text-4xl self-end mr-10 relative right-14 text-richblack-500' />
      </div>
    </div>
  )
}

export default Quote
