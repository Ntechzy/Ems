const Input = ({ label, handleChange, value, name, type }) => {
  // console.log(label);

  return (
    <div className="relative my-3 flex justify-center items-center">
      <input
        id={label}
        value={value}
        onChange={handleChange}
        placeholder={name}
        type={type}
        className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 "
      />
      <label
        htmlFor={label}
        className="absolute -top-[11px] text-sm transition-all left-3 peer-placeholder-shown:top-3.5 text-blue-500 bg-white -z-1 peer-placeholder-shown:bg-transparent"
      >
        {name}
      </label>
    </div>
  );
};

export default Input;
