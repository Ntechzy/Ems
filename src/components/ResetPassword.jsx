'use client'
import { password } from "@/Validation/AuthValidation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IoCloseCircle } from "react-icons/io5"
import Input from "./Input"
import axios from "axios"
import toast from "react-hot-toast"
import { handleError, handleResponse } from "@/lib/helper/YupResponseHandler"


const ResetPassword = ({ setisOpen }) => {
    const [empId, setempId] = useState(null)
    const [err, seterr] = useState()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/sign-up/forget-password', { empId })
            handleResponse(response)
            setisOpen(false)
        } catch (error) {
            const newError = handleError(error)
            seterr(newError)
        }
    };

    return (
        <div className="my-2 flex flex-col sm:w-[80%] md:w-[50%] bg-[#fff] justify-center m-auto py-3 px-4 rounded-xl">
            {/* header */}
            <div className='flex justify-between mx-5 items-center'>
                <div className='capitalize text-center text-3xl font-bold text-button_blue'>
                    Update Your Password
                </div>

                <div onClick={() => setisOpen(false)} className='text-button_blue text-2xl cursor-pointer'>
                    <IoCloseCircle />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm my-9 justify-center m-auto">

                <div className="mb-6">
                    <Input label="empId" handleChange={(e) => setempId(e.target.value)} value={empId} name={"Enter your Employee Id"} />
                    {err && <div className='text-red-700 text-center'> {err}</div>}
                </div>
                <button
                    type="submit"
                    className="bg-button_blue  w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Send mail
                </button>
            </form>
        </div>
    )
}

export default ResetPassword