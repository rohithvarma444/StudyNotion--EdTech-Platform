import React, { useEffect, useState } from 'react'
import { useRef } from 'react';


function UploadThumbnail({name,label,register,errors,setValue,getValues}) {
    const [loading,setLoading] = useState(false);
    const [imageFile,setImageFile] = useState(null);
    const [previewSource,setPreviewSource] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        register(name, {
            required: true,
            validate: (value) => value.length > 0,
        });
    },[name,register])


    //register on image change
    useEffect(() => {
        setValue(name,imageFile);
    },[imageFile,setValue,name]);
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
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

    const handleClick = () => {
        fileInputRef.current.click();
    }

    useEffect(() => {
        if (imageFile) {
            previewFile(imageFile);
        }
    }, [imageFile]);

  return (
    <div>
        <label htmlFor={name}>{label}</label>
        <input 
        type="file"
        ref={fileInputRef} 
        onChange={handleFileChange}
        className='w-full'
        accept='image/*'
        />

        <button type='button' onClick={handleClick} className='w-1/2 flex bg-yellow-5 text-black items-center'>Upload</button>
        {
            previewSource && (
                <div>
                    <img 
                    src={previewSource} 
                    alt="Preview Not availiable" 
                    className='w-full'
                    />
                </div>
            )
        }
        {errors[name] && <span>{errors[name].message}</span> }
    </div>
  )
}

export default UploadThumbnail