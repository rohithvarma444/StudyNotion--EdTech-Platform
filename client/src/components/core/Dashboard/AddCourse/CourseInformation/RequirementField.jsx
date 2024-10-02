import React, { useEffect, useState } from 'react';

function RequirementField({ name, label, register, errors, setValue, getValues,editCourse,course }) {
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);
    useEffect(() => {
        register(name, {
            required: true,
            validate: (value) => value.length > 0,
        });
    }, [name, register]);

    useEffect(() => {
        setValue(name, requirementList);
    }, [requirementList, setValue, name]);

    useEffect(() => {
        if(editCourse){
            setRequirementList(course.instructions);
        }
    },[])

    const handleAddRequirement = () => {
        if (requirement) {
            setRequirementList([...requirementList, requirement]);
            setRequirement("");
        }
    };

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    };

    return (
        <div>
            <label htmlFor={name}>{label}</label>
            <div>
                <input
                    type="text"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className='w-full text-black'
                />
                <button
                    type='button'
                    onClick={handleAddRequirement}
                    className='font-semibold text-yellow-50'
                >
                    Add
                </button>
            </div>
            {requirementList.length > 0 && (
                <ul>
                    {requirementList.map((requirement, index) => (
                        <li key={index}>
                            <span>{requirement}</span>
                            <button
                                type='button'
                                onClick={() => handleRemoveRequirement(index)}
                                className='text-xs text-richblack-300'
                            >
                                Clear
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {errors[name] && (
                <span>{label} is required</span>
            )}
        </div>
    );
}

export default RequirementField;
