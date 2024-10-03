export const SelectField = ({ label, options, value, onChange, id, defaultOption }) => {
    return (
        <select
            id={id}
            value={value}
            className="p-2 w-full rounded-md text-blue-900 border-2 outline-none peer border-gray-400"
            onChange={onChange}
        >
            <option value="" selected disabled >{defaultOption}</option >
            {options.map((option, i) => (
                <option key={i} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
}