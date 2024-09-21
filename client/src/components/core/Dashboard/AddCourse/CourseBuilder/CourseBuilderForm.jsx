import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { BiRightArrow } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI';

// CourseBuilderForm Component
function CourseBuilderForm() {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [editSectionName, setEditSectionName] = useState(null);

  useEffect(() => {
    console.log("Updated");
  }, [course]);

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const goToNext = () => {
    if (course?.courseContent?.length === 0) {
      toast.error("Please add at least one Section");
      return;
    }
    if (course?.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add at least one lecture in each section");
      return;
    }

    dispatch(setStep(3));
  };

  // Go Back to Previous Step
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  // Handle Form Submission
  const onSubmit = async (data) => {
    setLoading(true);
    let result;
    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        }, token
      );
    } else {
      result = await createSection({
        sectionName: data.sectionName,
        courseId: course._id,
      }, token);
    }

    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }

    setLoading(false);
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="text-white">
      <p>Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="sectionName">Section Name <sup>*</sup></label>
          <input
            type="text"
            className="w-full"
            id="sectionName"
            placeholder="Add Section Name"
            {...register("sectionName", { required: "Section Name is required" })}
          />
          {errors.sectionName && (
            <span>
              {errors.sectionName.message}
            </span>
          )}
        </div>

        <div className="flex flex-row gap-x-3">
          <IconBtn
            text={editSectionName ? "Save Changes" : "Create Section"}
            outline={true}
            type="submit"
            customClasses={"text-white"}
          >
            <MdOutlineAddCircleOutline />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              className="text-richblack-100 text-sm underline ml-10"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Display NestedView if course content exists */}
      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div className="flex justify-end gap-x-3 mt-10">
        <button
          type="button"
          onClick={goBack}
          className="rounded-md cursor-pointer flex items-center"
        >
          Back
        </button>
        <IconBtn onClick={goToNext}>
          <BiRightArrow />
        </IconBtn>
      </div>
    </div>
  );
}

export default CourseBuilderForm;
