import React from 'react'

const CheckboxGroup = ({ options, selectedValues, handleChange, name }) => {
    
    return (

        <div className='grid grid-cols-2 gap-2'>
            {options && options.map((option, index) => (
                <div key={option.id} className='flex items-center'>
                    <input
                        type="checkbox"
                        id={option._id}
                        value={option._id}
                        onChange={(e) => handleChange(e, name)}
                        checked={selectedValues.includes(option._id)}
                        className='mr-2'
                    />
                    <label htmlFor={option._id}>{option.name}</label>  
                </div>
            ))}
        </div>
    )
}

export default CheckboxGroup
