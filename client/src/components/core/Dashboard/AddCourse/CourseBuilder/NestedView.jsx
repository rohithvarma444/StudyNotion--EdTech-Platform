import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { BiDownArrow } from "react-icons/bi"
import { AiOutlinePlus } from "react-icons/ai"
import SubSectionModal from './SubSectionModal'
import ConfirmationModal from '../../../../common/ConfirmationModal'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI'
import { setCourse } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'

const NestedView = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Handle Section Deletion
  const handleDeleleSection = async (sectionId) => {
    const result = await deleteSection({ sectionId, courseId: course._id, token });
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  // Handle Sub-Section Deletion
  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    if (result) {
      // Update the course state with the new structure after sub-section deletion
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
      toast.success("Sub Section Deleted Successfully");
    }
    setConfirmationModal(null);
  };

  return (
    <div className="rounded-lg bg-richblack-700 p-6 px-8">
      {course?.courseContent?.map((section) => (
        <details key={section._id} open>
          <summary className="flex items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2">
            <div className="flex items-center gap-x-3">
              <RxDropdownMenu className="text-2xl text-richblack-50" />
              <p>{section.sectionName}</p>
            </div>
            <div className="flex items-center gap-x-3">
              <button onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}>
                <MdEdit className="text-xl text-richblack-300" />
              </button>
              <button
                onClick={() =>
                  setConfirmationModal({
                    text1: "Delete this Section?",
                    text2: "All the lectures in this section will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleleSection(section._id),
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
              >
                <RiDeleteBin6Line className="text-xl text-richblack-300" />
              </button>
              <span className="font-medium text-richblack-300">|</span>
              <BiDownArrow className="text-xl text-richblack-300" />
            </div>
          </summary>

          <div>
            {section?.subSection?.map((data) => (
              <div
                key={data._id}
                className="flex items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                onClick={() => setViewSubSection(data)}
              >
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p>{data.title}</p>
                </div>
                <div className="flex items-center gap-x-3" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setEditSubSection({ ...data, sectionId: section._id })}>
                    <MdEdit className="text-xl text-richblack-300" />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this Sub-Section?",
                        text2: "This lecture will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                  >
                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setAddSubSection(section._id)}
              className="mt-4 flex items-center gap-x-2 text-yellow-50"
            >
              <AiOutlinePlus />
              <p>Add Lecture</p>
            </button>
          </div>
        </details>
      ))}

      {addSubSection ? (
        <SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true} />
      ) : viewSubSection ? (
        <SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true} />
      ) : editSubSection ? (
        <SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true} />
      ) : null}

      {confirmationModal ? <ConfirmationModal modalData={confirmationModal} /> : null}
    </div>
  );
};

export default NestedView;
