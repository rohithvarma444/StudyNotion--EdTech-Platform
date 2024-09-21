import React, { useEffect, useState, useRef } from 'react';

function UploadThumbnail({ name, label, register, errors, setValue, getValues }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const fileInputRef = useRef(null);

  // Registering the file input and setting custom validation
  useEffect(() => {
    register(name, {
      required: 'Image is required',
      validate: () => {
        // Ensure the file is valid (i.e., not null)
        const file = getValues(name);
        return file instanceof File && file.size > 0;
      },
    });
  }, [name, register, getValues]);

  // Updating the image file value in the form
  useEffect(() => {
    if (imageFile) {
      setValue(name, imageFile);
    }
  }, [imageFile, setValue, name]);

  const handleFileChange = (e) => {
    setLoading(true);
    const file = e.target.files[0];

    // Check if file is selected
    if (file) {
      setImageFile(file);
    }
    setLoading(false);
  };

  // Generating image preview
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  // Triggering preview when image file changes
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
      
      {/* Preview Section */}
      {previewSource && (
        <div>
          <img 
            src={previewSource} 
            alt="Preview Not available" 
            className='w-full'
          />
        </div>
      )}

      {/* Error Handling */}
      {errors[name] && <span>{errors[name].message}</span>}
    </div>
  );
}

export default UploadThumbnail;
