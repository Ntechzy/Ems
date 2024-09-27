import React from 'react'

const CheckboxGroup = ({ options, selectedValues, handleChange, name }) => {
    return (

        <div className='grid grid-cols-2 gap-2'>
            {options.map((option, index) => (
                <div key={option.id} className='flex items-center'>
                    <input
                        type="checkbox"
                        id={`${name}_${option.id}`}
                        value={option.id} 
                        onChange={(e) => handleChange(e, name)}
                        checked={selectedValues.includes(option.id)}  
                        className='mr-2'
                    />
                    <label htmlFor={`${name}_${option.id}`}>{option.name}</label>  {/* Show the name */}
                </div>
            ))}
        </div>
    )
}

export default CheckboxGroup
