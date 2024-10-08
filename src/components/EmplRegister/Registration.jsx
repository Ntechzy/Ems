'use client'
import { associated_with, fields, role } from '../../data/RegistrationData'
import Input from '../Input'
import { useEffect, useState } from 'react'
import { genratePassword } from '@/lib/GenratePassword'
import { IoCloseCircle } from "react-icons/io5";
import { RegistrationValidate } from '@/Validation/AuthValidation'
import CheckboxGroup from '../CheckboxGroup'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SelectField } from './SelectField' 
import { handleError, handleResponse } from '@/lib/helper/YupResponseHandler'
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

    console.log(value);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/registration-data')
                setData(res.data.data)
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
        e.preventDefault();
        console.log("Starting submission...");

        try {
            await RegistrationValidate.validate(value, { abortEarly: false });

            seterr(null);
            const response = await axios.post('/api/sign-up', value);
            handleResponse(response)
        } catch (error) {
            const newError = handleError(error)
            seterr(newError);
        }
    };

    const genrate = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const newPassword = genratePassword(16)
        setValue({ ...value, ["password"]: newPassword });
    };

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

                            <div>

                                <SelectField
                                    label="Associated With"
                                    id="associated_with"
                                    options={associated_with.map(item => ({ value: item.name, label: item.name }))}
                                    value={value.associated_with}
                                    defaultOption="Select Associated With"
                                    onChange={handleChange} 
                                    
                                />
                                {err && <div className='text-red-700 text-center'> {err["associated_with"]}</div>}
                            </div>
                            <div>

                                <SelectField
                                    label="Department"
                                    id="department"
                                    defaultOption="Select Department"
                                    options={data.department.map(dep => ({ value: dep._id, label: dep.name }))}
                                    value={value.department}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>

                                <SelectField
                                    label="Designation"
                                    id="designation"
                                    defaultOption="Select Designation"
                                    options={
                                        data.department
                                            .filter(dep => dep._id === value.department)[0]?.designations
                                            .map(des => ({ value: des._id, label: des.name })) || []
                                    }
                                    value={value.designation}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* interview done by & who finalize salary */}
                        <div className='flex gap-3 my-3'>

                            <div>

                                <SelectField
                                    label="Interview Done By"
                                    id="interview_done_by"
                                    defaultOption="Interview Done by"
                                    options={
                                        data.department
                                            .filter(dep => dep._id === value.department)[0]?.manager
                                            .map(man => ({ value: man._id, label: man.name })) || []
                                    }
                                    value={value.interview_done_by}
                                    onChange={handleChange}
                                />
                                {err && <div className='text-red-700 text-center'> {err["interview_done_by"]}</div>}
                            </div>

                            <div>

                                <SelectField
                                    label="Who Finalizes Salary"
                                    id="who_finalize_salary"
                                    defaultOption="Who Finalizes Salary"
                                    options={
                                        data.department
                                            .filter(dep => dep._id === value.department)[0]?.manager
                                            .map(man => ({ value: man._id, label: man.name })) || []
                                    }
                                    value={value.who_finalize_salary}
                                    onChange={handleChange}
                                />
                                {err && <div className='text-red-700 text-center'> {err["who_finalize_salary"]}</div>}
                            </div>

                            <div>

                                <SelectField
                                    label="Role"
                                    id="role"
                                    defaultOption="Select Role"
                                    options={role.map(r => ({ value: r.name, label: r.name }))}
                                    value={value.role}
                                    onChange={handleChange}
                                />
                            </div>
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

                                {err && <div className='text-red-700 text-center'> {err["alloted_hardwares"]}</div>}

                            </div>

                            <div className='my-3'>
                                <label className='block font-semibold mb-2'>Alloted Softwares</label>
                                <CheckboxGroup
                                    options={data.software}
                                    selectedValues={value.alloted_softwares}
                                    handleChange={handleCheckboxChange}
                                    name="alloted_softwares"
                                />
                                {err && <div className='text-red-700 text-center'> {err["alloted_softwares"]}</div>}
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