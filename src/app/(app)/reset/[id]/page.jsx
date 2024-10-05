'use client'
import { passwordValidationSchema } from "@/Validation/AuthValidation";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "@/components/Input";
import { handleError, handleResponse } from "@/lib/helper/YupResponseHandler";
const Page = () => {
    const [newPass, setNewPass] = useState("");
    const token = useParams().id;

    const [err, setErr] = useState();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await passwordValidationSchema.validate({ newPass }, { abortEarly: false });
            setErr(null);

            const response = await axios.put('/api/reset-pass', { newPass, token });
            handleResponse(response);
        } catch (error) {
            const newError = handleError(error);
            setErr(newError);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        setNewPass(e.target.value);
    };

    return (
        <div className="my-8 flex flex-col w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden mx-auto p-6">
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-button_blue'>Reset Your Password</h2>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-6">
                    <Input
                        label="New Password"
                        handleChange={handleChange}
                        value={newPass}
                        name="Enter your new password"
                        type="password"
                    />
                    {err?.newPass && <div className='text-red-600 mt-1'>{err.newPass}</div>}
                </div>

                <button
                    type="submit"
                    className="bg-button_blue w-full text-white font-semibold py-2 rounded-md shadow hover:bg-button_blue-dark transition duration-200"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
}

export default Page;
