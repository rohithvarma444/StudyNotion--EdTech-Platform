import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { MdClose } from "react-icons/md";
import { createRating } from '../../../services/operations/courseDetailsAPI';
import { useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';


function CourseReviewModal({setReviewModal}) {

    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state) => state.auth);
    const {courseEntireData} = useSelector((state)=> state.viewCourse);

    const{
        register,
        setValue,
        getValues,
        formState:{errors},
        handleSubmit
    } = useForm();

    useEffect(() => {
        setValue("courseExperience","");
        setValue("courseRating",0);
    },[])

    const ratingChanged = (newRating) => {
        setValue("courseRating",newRating);
    }

    const onSubmit = async(data)=> {
        const res = await createRating({
            courseId: courseEntireData._id,
            rating:data.courseRating,
            review: data.courseExperience
        },token)
        setReviewModal(false);
    }

  return (
    <>

      <div className='flex flex-col text-white'>
        <div className='flex flex-row justify-between bg-richblack-800'>
            <div className=''>
                Add Review
            </div>
            <MdClose />
        </div>
        <div className='flex flex-row'>
            <img src="" alt="" />
            <div className='flex flex-col gap-y-5'>
                <p></p>
                <p></p>
            </div>
        </div>
        <form action=""
        onSubmit={handleSubmit(onSubmit)}
        className='mt-6 flex flex-col items-center'>

            <ReactStars 
                 count={5}
                 onChange={ratingChanged}
                 size={24}
                 activeColor="#ffd700"
             />
             f


            <div>
                <label htmlFor='courseExperience'>
                    Add Your Experience*
                </label>
                <textarea 
                    id='courseExperience'
                    placeholder='Add Your Experience here'
                    {...register("courseExperience", {required:true})}
                    className='form-style min-h-[130px] w-full'
                />
                {
                    errors.courseExperience && (
                        <span>
                            Please add your experience
                        </span>
                    )
                }
            </div>


            <div>
                <button
                onClick={() => setReviewModal(false)}
                >
                    Cancel
                </button>
                <IconBtn 
                    text="save"
                />
            </div>
    
        </form>

      </div>
    </>
  )
}

export default CourseReviewModal