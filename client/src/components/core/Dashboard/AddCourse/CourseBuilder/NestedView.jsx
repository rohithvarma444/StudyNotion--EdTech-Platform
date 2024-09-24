import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { BiSolidDownArrow } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import SubSectionModal from './SubSectionModal';
import { useState } from 'react';
import ConfirmationModal from "../../../../common/ConfirmationModal"


function NestedView({handleChangeEditSectionName}) {
  const {course} = useSelector((state)=> state.course);
  const {token} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  const [addSubSection,setAddSubSection] = useState(null);
  const [viewSubSection,setViewSubSection] = useState(null);
  const [editSubSection,setEditSubSection] = useState(null);

  const [confirmationModal,setConfirmationModal] = useState(null);




  const handleDeleteSection = async (id) =>{

  }

  const handleDeleteSubSection = async (sectionId,subSectionId) => {

  }


  return (
    <div className='mt-10'>
      <div className='rounded-lg bg-richblack-700 p-6 px-8'>
        {course?.courseContent?.mao((section) => (
          <details key={section._id}>

            <summary className='flex items-center justify-between gap-x-3 border-b-2'>
              <div>
                < RxDropdownMenu />
                <p>{section.sectionName}</p>
              </div>
              <div>
                <button onClick={handleChangeEditSectionName(section._id,section.sectionName)}>
                 <MdEdit />
                </button>
                <button onClick={() => setConfirmationModal(
                  {
                    text1: "Delete this Section?",
                    text2: "All the lectures will be deleted",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleteSection(section._id),
                    btn2Handler: ()=> setConfirmationModal(null)
                  }
                )}>
                  <MdDelete />
                </button>

                <span>|</span>
                <button>
                  <BiSolidDownArrow className={'text-richblack-300 text-xl'}/>
                </button>

              </div>
            </summary>

            <div>
              {
                section.subSection.map((data)=> (
                  <div
                  className='flex items-center justify-between gap-x-3 border-b-2'
                  key={data?._id}
                  onClick={() => setViewSubSection(data)}
                  >
                    <div className='flex items-center gap-x-3'>
                      <RxDropdownMenu/>
                      <p>{data.title}</p>
                    </div>

                    <div
                    className='flex items-center gap-x-3'
                    >

                      <button onClick={() => setEditSubSection({...data,sectionId:section._id})}>
                        <MdEdit/>
                      </button>
                      <button
                      onClick={() => setConfirmationModal({
                        text1: "Delete this Sub Section?",
                        text2: "Selected lecture will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleteSubSection(data._id,section._id),
                        btn2Handler: ()=> setConfirmationModal(null)
                      })}
                      >
                        <MdDelete/>
                      </button>

                    </div>

                  </div>
                ))
              }
              <button
              onClick={setAddSubSection(section._id)}
              className='mt-4 flex items-center text-yellow-50'
              >
                <AiOutlinePlus/>
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {
        addSubSection ? (
          <SubSectionModal
          modalData={addSubSection}
          setModaldata={setAddSubSection}
          add={true} 
          />
        ) : viewSubSection ? (
          <SubSectionModal 
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
          />
        ) : editSubSection ? (
          <SubSectionModal 
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
          />
        ) : (
          <div></div>
        )
      }
      {confirmationModal ? 
      (
        <ConfirmationModal modalData={confirmationModal} />
      )
      : (<div></div>)
        }

    </div>
  )
}

export default NestedView