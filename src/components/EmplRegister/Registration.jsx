'use client'
import { fields } from '../../data/RegistrationData'
import Input from '../Input'
import { useEffect, useState } from 'react'
import { genratePassword } from '@/lib/GenratePassword'
import { IoCloseCircle } from "react-icons/io5";
import { RegistrationValidate } from '@/Validation/AuthValidation'
import CheckboxGroup from '../CheckboxGroup'
import axios from 'axios'
import toast from 'react-hot-toast'
const Registration = ({ close }) => {
    const [data, setData] = useState(null)
    const [err, seterr] = useState()
    const [value, setValue] = useState({
        name: "",
        email: "",
        password: "",
        mobile_no: "",
        role: "",
        designation: "",
        department: "",
        alloted_hardwares: [],
        alloted_softwares: [],
        associated_with: "",
        salary: "",
        interview_done_by: "",
        who_finalize_salary: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/registration-data')
                setData(res.data.data)
                console.log(res.data.data);

            } catch (error) {
                toast.error(error.message)
            }
        }

        fetchData()
    }, [])


    const handleChange = (e) => {
        setValue({ ...value, [e.target.id]: e.target.value })
    }

    const handleCheckboxChange = (e, fieldName) => {
        const selected = value[fieldName];
        if (e.target.checked) {
            setValue({ ...value, [fieldName]: [...selected, e.target.value] });
        } else {
            setValue({ ...value, [fieldName]: selected.filter(item => item !== e.target.value) });
        }
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
            seterr(newError)
        }
    }

    const genrate = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const newPassword = genratePassword(16)
        setValue({ ...value, ["password"]: newPassword });
    };

    console.log(value);


    return (
        <div className='my-2 flex flex-col sm:w-[80%] md:w-[50%] bg-white justify-center m-auto py-3 px-4 rounded-xl'>

            {/* header */}
            <div className='flex justify-between mx-5 items-center'>
                <div className='capitalize text-center text-3xl font-bold text-button_blue'>
                    Register an employee
                </div>

                <div onClick={() => close(false)} className='text-button_blue text-2xl cursor-pointer'>
                    <IoCloseCircle />
                </div>
            </div>

            {/* form started here */}
            {
                data ?
                    (<form onSubmit={handleSubmit} className=' flex justify-center flex-col mx-3  overflow-auto '>

                        {/* name, email, mobile no, password, role */}
                        {
                            fields.map((obj, i) => (
                                <div key={i}>
                                    <Input label={obj.label} handleChange={handleChange} value={value.field} name={obj.name} type={obj.type} />
                                    {err && <div className='text-red-700 text-center'> {err[obj.label]}</div>}
                                </div>

                            ))
                        }

                        {/* password */}
                        <div className='flex md:flex-row flex-col gap-3 my-3'>
                            <input
                                value={value.password}
                                name="password"
                                type="text"
                                readOnly
                                aria-label="Generated Password"
                                className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400 "
                            />
                            <button className='bg-button_blue p-2 md:w-[20%] flex justify-center items-center m-auto rounded-xl text-white text-lg' onClick={genrate}>Generate</button>
                        </div>
                        {err && <div className='text-red-700 text-center'> {err["password"]}</div>}

                        {/* designation, department, associated with */}
                        <div className='flex gap-3 my-3'>

                            <select name="associated_with" id="associated_with" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>

                                <option value="option from db" >associated_with</option>

                            </select>

                            {/* designation and department */}
                            <select name="department" id="department" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>
                                <option selected disabled>Select department</option>
                                {
                                    data.department.map((obj, i) => (
                                        <option key={i} id='department' value={obj.name}>{obj.name}</option>
                                    ))
                                }
                            </select>


                            <select name="designation" id="designation" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>

                                <option selected disabled>Select department</option >
                                {
                                    data.department.map((obj) => (
                                        obj.name == value.department &&

                                        obj.designations.map((des, i) => (
                                            <option key={i} value={des._id}> {des.name}</option>

                                        ))
                                    ))
                                }

                            </select>
                        </div>

                        {/* interview done by & who finalize salary */}
                        <div className='flex gap-3 my-3'>

                            <select name="interview_done_by" id="interview_done_by" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>



                                <option selected disabled >Interview Done by</option>

                                {
                                    data.department.map((obj) => (
                                        obj.name == value.department &&

                                        obj.manager.map((des, i) => (
                                            <option key={i} value={des._id}> {des.name}</option>

                                        ))
                                    ))
                                }

                            </select>

                            <select name="who_finalize_salary" id="who_finalize_salary" className=" p-2 focus:border-blue-500 w-full placeholder-transparent rounded-md text-blue-900 border-2 outline-none peer border-gray-400" onChange={handleChange}>
                                <option selected disabled >Who finalize salary </option>

                                {
                                    data.department.map((obj) => (
                                        obj.name == value.department &&

                                        obj.manager.map((des, i) => (
                                            <option key={i} value={des._id}> {des.name}</option>

                                        ))
                                    ))
                                }
                            </select>

                        </div>

                        {/* allocated hardware & softwarre */}

                        <div className='flex justify-around flex-wrap gap-3 my-3'>
                            <div className='my-3'>
                                <label className='block font-semibold mb-2'>Alloted Hardwares</label>
                                <CheckboxGroup
                                    options={data.hardware}
                                    selectedValues={value.alloted_hardwares}
                                    handleChange={handleCheckboxChange}
                                    name="alloted_hardwares"
                                />
                            </div>

                            <div className='my-3'>
                                <label className='block font-semibold mb-2'>Alloted Softwares</label>
                                <CheckboxGroup
                                    options={data.software}
                                    selectedValues={value.alloted_softwares}
                                    handleChange={handleCheckboxChange}
                                    name="alloted_softwares"
                                />
                            </div>
                        </div>

                        <button type='submit' className='bg-button_blue p-2 md:w-[20%] flex justify-center items-center m-auto rounded-xl text-white text-lg'>Submit</button>
                    </form>) :
                    (<div className='flex justify-center items-center m-auto'>Loading...</div>)
            }
        </div >
    )
}

export default Registration