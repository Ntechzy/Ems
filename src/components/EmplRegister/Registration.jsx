'use client'
import { fields } from '../../data/RegistrationData'
import Input from '../Input'
import { useState } from 'react'
import { genratePassword } from '@/lib/GenratePassword'
import { IoCloseCircle } from "react-icons/io5";
import { RegistrationValidate } from '@/Validation/AuthValidation'
const Registration = ({ close }) => {
    const [err, seterr] = useState()
    const [value, setValue] = useState({
        employee_id: "",
        name: "",
        email: "",
        password: "Genrate your password",
        mobile_no: "",
        location: "",
        role: "",
        designation: "",
        department: "",
        alloted_hardwares: "",
        alloted_softwares: ""
    })

    const handleChange = (e) => {
        setValue({ ...value, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await RegistrationValidate.validate(value, { abortEarly: false })
            seterr(null)
        } catch (error) {
            const newError = {};
            error.inner.forEach(elem => {
                newError[elem.path] = elem.message

            });
            console.log(newError);
            seterr(newError)
        }
    }

    console.log(value);

    const genrate = (e) => {
        const newPassword = genratePassword(16)
        setValue({ ...value, ["password"]: newPassword });
    };


    return (
        <div className='my-2 flex flex-col sm:w-[80%] md:w-[50%] bg-white justify-center m-auto py-3 rounded-2xl'>
            <div className='flex justify-between mx-5 items-center'>
                <div className='capitalize text-center text-3xl font-bold text-button_blue'>
                    Register an employee
                </div>

                <div onClick={() => close(false)} className='text-button_blue text-2xl cursor-pointer'>
                    <IoCloseCircle />
                </div>
            </div>

            {/* form started here */}
            <form onSubmit={handleSubmit} className=' flex justify-center flex-col mx-3  overflow-auto '>

                {
                    fields.map((obj, i) => (
                        <>
                            <Input key={i} label={obj.label} handleChange={handleChange} value={value.field} name={obj.name} type={obj.type} />
                            {err && <div className='text-red-700 text-center'> {err[obj.label]}</div>}
                        </>

                    ))
                }

                <div className='flex md:flex-row flex-col gap-3 my-3'>
                    <input
                        value={value.password}
                        name="password"
                        type="text"
                        readOnly
                        aria-label="Generated Password"
                        className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 "
                    />
                    <button className='bg-button_blue p-2 md:w-[20%] flex justify-center items-center m-auto rounded-xl text-white text-lg' onClick={() => genrate()}>Generate</button>

                </div>

                <div className='flex gap-3 my-3'>
                    <select name="designation" id="designation" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>
                        <option value="option from db" >opetion from db</option>
                    </select>

                    <select name="department" id="department" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>
                        <option value="option from db" >opetion from db</option>
                    </select>
                </div>

                <div className='flex gap-3 my-3'>
                    <select name="alloted_hardwares" id="alloted_hardwares" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 " onChange={handleChange}>
                        <option value="alloted_hardwares" >alloted_hardwares</option>
                    </select>

                    <select name="alloted_softwares" id="alloted_softwares" onChange={handleChange} className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 ">
                        <option value="jira db">jira</option>
                        <option value="slack db">slack</option>
                        <option value="monday db">monday</option>
                    </select>
                </div>


                <button className='bg-button_blue p-2 md:w-[20%] flex justify-center items-center m-auto rounded-xl text-white text-lg'>Submit</button>
            </form>
        </div >
    )
}

export default Registration