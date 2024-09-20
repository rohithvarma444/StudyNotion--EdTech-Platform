import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';



function CourseInformationForm() {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors},
    } = useForm();

    const dispatch = useDispatch();
    const {course,editCourse} = useSelector((state) => state.course)
    const [courseCategories,setCourseCategories] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        const getCategories = async() => {
            setLoading(true);
            const categories = fetch 
        }
    })
  return (
    
  )
}

export default CourseInformationForm