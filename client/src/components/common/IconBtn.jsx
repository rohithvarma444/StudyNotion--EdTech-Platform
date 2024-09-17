import React from 'react'

function IconBtn({
  text,
  onclick,  // Correct casing
  children,
  disabled,
  outline = false,
  customClasses,
  type
}) {
return (
  <button
    disabled={disabled}
    onClick={onclick}  
    className={customClasses} 
    type={type}  
  >
    {
      children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        <span>{text}</span> 
      )
    }
  </button>
);
}

export default IconBtn;
