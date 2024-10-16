import React, { useRef, useState, useEffect } from 'react';
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { updateDispalyPicture } from "../../../../services/operations/SettingsAPI";
import IconBtn from '../../../common/IconBtn';

function ChangeProfilePicture() {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewSource, setPreviewSource] = useState(null);

    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
        }
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        }
    }

    const handleFileUpload = () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("displayPicture", imageFile);
            dispatch(updateDispalyPicture(token, formData)).then(() => {
                setLoading(false);
            }).catch((error) => {
                console.log("ERROR MESSAGE - ", error.message);
                setLoading(false);
            });
        } catch (error) {
            console.log("ERROR MESSAGE - ", error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (imageFile) {
            previewFile(imageFile);
        }
    }, [imageFile]);

    return (
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
            <div className="flex items-center gap-x-4">
                <img
                    src={previewSource || user?.image || 'default-image-url'}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[78px] rounded-full object-cover"
                />
                <div className="space-y-2">
                    <p>Change Profile Picture</p>
                    <div className="flex flex-row gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/gif, image/jpeg"
                        />
                        <button
                            onClick={handleClick}
                            disabled={loading}
                            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
                        >
                            Select
                        </button>
                        <IconBtn
                            text={loading ? "Uploading..." : "Upload"}
                            onclick={handleFileUpload}
                            customClasses={loading ? "opacity-50 cursor-not-allowed" : "flex flex-row bg-yellow-500 p-2 rounded-md"}
                        >
                            {!loading && (
                                <FiUpload className="text-lg text-white relative left-2" />
                            )}
                        </IconBtn>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChangeProfilePicture;
