import { useState } from "react";


const Select = ({ options, selectedOptionValue, userId, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(selectedOptionValue);
    const handleChange = async (event) => {
        setSelectedOption(event.target.value);
        await onChange(userId, event.target.value);
    };
    return (
        <select className="p-2 cursor-pointer rounded-md" value={selectedOption} onChange={handleChange}>
            {
                options.map((obj, i) => (
                    <option key={i} value={obj.value} selected={obj.value == selectedOption} >{obj.label}</option>
                ))
            }
        </select>
    )
}

export default Select;