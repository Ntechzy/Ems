'use client'
import Input from '@/components/Input';
import { useState } from 'react';

const Page = () => {
    const [value, setValue] = useState({
        username: "",
        password: ""
    })


    const handleSubmit = (event) => {
        event.preventDefault();
    };
    const handleChange = (e) => {
        e.preventDefault();
        setValue({ ...value, [e.target.id]: e.target.value })
    };


    return (
        <div className="flex min-h-screen">

            <div className="flex flex-col items-center justify-center w-1/2 bg-gradient-to-b  from-[#93fdc1c2] to-[#dfbd73] ">
                <h1 className="text-4xl font-bold text-black mb-4">
                    Welcome Aboard
                </h1>
                <h2>
                    Together, We Create the Solutions of Tomorrow.
                </h2>
                {/*  from-pink-500 to-red-500 */}
            </div>

            <div className="flex flex-col items-center justify-center w-1/2 bg-white px-10 py-20">
                <h2 className="text-2xl font-bold mb-8">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="w-full max-w-sm">

                    <div className="mb-6">
                        <Input label="username" handleChange={handleChange} value={value.username} name={"Enter your User name"} />
                    </div>

                    <div className="mb-6">
                        <Input label="password" handleChange={handleChange} value={value.password} name={"Enter your password"} />
                    </div>

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-[#93fdc1c2] to-[#dfbd73] w-full text-blue-950 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign In
                    </button>
                </form>
            </div>


        </div>
    );
}

export default Page;