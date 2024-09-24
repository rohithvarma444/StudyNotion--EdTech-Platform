import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import Upload from '../Upload';
import IconBtn from '../../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross1 } from 'react-icons/rx';
import toast from 'react-hot-toast';

function SubSectionModal({
    modalData,
    edit = false,
    add = false,
    view = false,
    setModalData, // Corrected prop name
}) {

    const {
        register,
        setValue,
        getValues,
        formState:{errors},
        handleSubmit
    } = useForm();


    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (view || edit) {
            setValue("lectureTitle", modalData.Title);
            setValue("lectureDescription", modalData.description);
            setValue("lectureVideo", modalData.videourl); // Fixed typo
        }
    }, [modalData, view, edit]); // Added dependencies

    const isFormUpdated = () => {
        const currentValues = getValues();
        return (
            currentValues.lectureTitle !== modalData.Title ||
            currentValues.lectureDescription !== modalData.description ||
            currentValues.lectureVideo !== modalData.videourl
        );
    };

    const handleEditSubSection = async () => {
        const formData = new FormData();
        const currentValue = getValues();

        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id);

        if (currentValue.lectureTitle !== modalData.Title) {
            formData.append("title", currentValue.lectureTitle);
        }
        if (currentValue.lectureDescription !== modalData.description) {
            formData.append("description", currentValue.lectureDescription);
        }
        if (currentValue.lectureVideo !== modalData.videourl) {
            formData.append("video", currentValue.lectureVideo);
        }

        setLoading(true);
        const response = await updateSubSection(formData, token);
        if (response) {
            dispatch(setCourse(response));
        }
        setModalData(null); // Corrected function call
        setLoading(false);
    };

    const onSubmit = async (data) => {
        if (view) {
            return;
        }

        if (edit) {
            if (!isFormUpdated()) {
                toast.error("Data is not updated, please check");
                return;
            } else {
                handleEditSubSection();
                return;
            }
        }

        // Handle add
        if (add) {
            const formData = new FormData();
            formData.append("sectionId", modalData.sectionId); // Assuming correct sectionId in modalData
            formData.append("Title", data.lectureTitle);
            formData.append("Description", data.lectureDescription);
            formData.append("Video", data.lectureVideo);

            setLoading(true);
            const result = await createSubSection(formData, token); // Added await
            if (result) {
                dispatch(setCourse(result));
            }
            setModalData(null);
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <p>{view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture</p>
                <button onClick={() => !loading && setModalData(null)}>
                    <RxCross1 />
                </button>
            </div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <Upload
                    name="lectureVideo"
                    label="Lecture Video"
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    errors={errors}
                    video={true}
                    viewData={view ? modalData.videoUrl : null}
                    editData={edit ? modalData.videoUrl : null}
                />

                <div>
                    <label htmlFor="lectureTitle">Lecture Title</label>
                    <input
                        type="text"
                        className='w-full text-black'
                        name="lectureTitle"
                        id="lectureTitle"
                        placeholder='Enter the Lecture title'
                        {...register("lectureTitle", { required: true })}
                    />
                    {errors.lectureTitle && <span>Lecture title is required</span>}
                </div>

                <div>
                    <label htmlFor="lectureDescription">Lecture Description</label>
                    <textarea
                        name="lectureDescription"
                        id="lectureDescription"
                        placeholder='Enter lecture description'
                        {...register("lectureDescription", { required: true })}
                        className='w-full text-black'
                    ></textarea>
                    {errors.lectureDescription && <span>Lecture Description is required</span>}
                </div>

                {!view && (
                    <div>
                        <IconBtn text={loading ? "Loading..." : edit ? "Save Changes" : "Save"} />
                    </div>
                )}
            </form>
        </div>
    );
}

export default SubSectionModal;
