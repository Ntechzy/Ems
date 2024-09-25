'use client'
import { fields } from './RegistrationData'
import Input from '../Input'
import { useState } from 'react'
import { genratePassword } from '@/lib/GenratePassword'
import { IoCloseCircle } from "react-icons/io5";

const Registration = ({ close }) => {
    const [value, setValue] = useState({
        employee_id: "",
        name: "",
        email: "",
        password: "Genrate your password",
        mobile_no: "",
        location: "",
        role: "",
        designation: "",
        department: ""
    })

    const handleChange = (e) => {
        setValue({ ...value, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const genrate = (e) => {
        e.preventDefault()
        const newPassword = genratePassword(16)
        setValue({ ...value, ["password"]: newPassword });
    };

    return (
        <div className='h-auto my-2 flex flex-col sm:w-[80%] md:w-[50%] bg-white justify-center m-auto py-3 rounded-2xl'>
            <div className='flex justify-between mx-5 items-center'>
                <div className='capitalize text-center text-3xl font-bold text-button_blue'>
                    Register an employee
                </div>

                <div onClick={() => close(false)} className=' text-button_blue text-2xl'>
                    <IoCloseCircle />
                </div>
            </div>

            {/* form started here */}
            <form onSubmit={handleSubmit} className='flex justify-center flex-col mx-3 '>

                {
                    fields.map((obj, i) => (
                        <Input key={i} label={obj.label} handleChange={handleChange} value={value.field} name={obj.name} type={obj.type} />
                    ))
                }
                <div className='flex md:flex-row flex-col gap-3 my-3'>
                    <input
                        defaultValue={value.password}
                        name="password"
                        type="text"
                        aria-label="password"
                        disabled
                        className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 "
                    />
                    <button className='bg-button_blue p-2 md:w-[20%] flex justify-center items-center m-auto rounded-xl text-white text-lg' onClick={genrate}>Generate</button>

                </div>

                <div className='flex gap-3 my-3'>
                    <select name="designation" id="designation" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 ">
                        <option value="option from db">opetion from db</option>
                    </select>

                    <select name="department" id="department" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 ">
                        <option value="option from db">opetion from db</option>
                    </select>
                </div>

                <button className='bg-button_blue p-2 md:w-[20%] flex justify-center items-center m-auto rounded-xl text-white text-lg'>Submit</button>
            </form>
        </div >
    )
}

export default Registration