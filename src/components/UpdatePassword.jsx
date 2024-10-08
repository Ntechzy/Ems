'use client'
import { password } from "@/Validation/AuthValidation"
import { useState } from "react"
import { IoCloseCircle } from "react-icons/io5"
import Input from "./Input"
import axios from "axios"
import { handleError, handleResponse } from "@/lib/helper/YupResponseHandler"
import Loader from "./Loader"


const UpdatePassword = ({ setisOpen }) => {
    const [value, setValue] = useState({
        oldPass: "",
        newPass: ""
    })

    const [confirmPass, setConfirmPass] = useState("");
    const [isLoading, setisLoading] = useState(false)
    const [err, seterr] = useState()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setisLoading(true)
            await password.validate({ ...value, confirmPass }, { abortEarly: false })
            seterr(null)
            const response = await axios.put('/api/reset-pass/update', value)
            setisLoading(false)
            handleResponse(response)
        } catch (error) {
            setisLoading(false)
            const newError = handleError(error)
            seterr(newError);
        }
    };
    const handleChange = (e) => {
        e.preventDefault();
        setValue({ ...value, [e.target.id]: e.target.value })
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
                    <Input label="oldPass" handleChange={handleChange} value={value.username} name={"Enter your Old password"} />
                    {err && <div className='text-red-700 text-center'> {err["oldPass"]}</div>}
                </div>

                <div className="mb-6">
                    <Input label="newPass" handleChange={handleChange} value={value.password} name={"Enter your new password"} />
                    {err && <div className='text-red-700 text-center'> {err["newPass"]}</div>}
                </div>

                <div className="mb-6">
                    <Input label="confirmPass" handleChange={(e) => setConfirmPass(e.target.value)} value={confirmPass} name={"Enter your new password"} />
                    {err && <div className='text-red-700 text-center'> {err["confirmPass"]}</div>}
                </div>

                <button
                    type="submit"
                    className="bg-button_blue  w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {isLoading ? <Loader /> : " Update Password"}
                </button>
            </form>
        </div>
    )
}

export default UpdatePassword