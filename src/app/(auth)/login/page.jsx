'use client'
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import { sinInValidate } from '@/Validation/AuthValidation';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

const Page = () => {
    const router = useRouter()
    const [value, setValue] = useState({
        username: "",
        password: ""
    })
    const [err, seterr] = useState()
    const { data: session, status } = useSession()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await sinInValidate.validate(value, { abortEarly: false })
            seterr(null)
            const data = await signIn('credentials', {
                redirect: false,
                username: value.username,
                password: value.password,
            })
            if (data.error) {
                console.log(data.error);
            }
            else {
                console.log("login sucessfull");
                router.push('/')
            }
        } catch (error) {
            const newError = {};
            error.inner.forEach(elem => {
                newError[elem.path] = elem.message

            });
            console.log(newError);
            seterr(newError)
        }
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
                        {err && <div className='text-red-700 text-center'> {err["username"]}</div>}
                    </div>

                    <div className="mb-6">
                        <Input label="password" handleChange={handleChange} value={value.password} name={"Enter your password"} />
                        {err && <div className='text-red-700 text-center'> {err["password"]}</div>}
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