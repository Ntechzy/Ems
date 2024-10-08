'use client'
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import { sinInValidate } from '@/Validation/AuthValidation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { handleError } from '@/lib/helper/YupResponseHandler';
import ResetPassword from '@/components/ResetPassword';
import Loader from '@/components/Loader';

const Page = () => {
    const router = useRouter()
    const [value, setValue] = useState({
        username: "",
        password: ""
    })
    const [err, seterr] = useState()
    const [openModal, setOpenModal] = useState(false)
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
                toast.error(data.error)
                console.log(data.error);
            }
            else {
                toast.success('Login successful')
                router.push('/')
            }
        } catch (error) {
            const newError = handleError(error);
            seterr(newError)
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        setValue({ ...value, [e.target.id]: e.target.value })
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">

            {/* Left Section */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-gradient-to-r from-[rgba(2,7,23,0.76)] to-[#114061] p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white text-center">
                    Welcome to Ntechzy pvt. ltd.
                </h1>
                <h2 className="text-white text-center">
                    Together, We Create the Solutions of Tomorrow.
                </h2>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 bg-white px-6 md:px-10 py-10 md:py-20">
                <h2 className="text-2xl font-bold mb-8 text-center">
                    Sign In
                </h2>

                <form onSubmit={handleSubmit} className="w-full max-w-xs md:max-w-sm">
                    <div className="mb-4 md:mb-6">
                        <Input label="username" handleChange={handleChange} value={value.username} name={"Enter your User name"} />
                        {err && <div className='text-red-700 text-center'>{err["username"]}</div>}
                    </div>

                    <div className="mb-4 md:mb-6">
                        <Input label="password" handleChange={handleChange} value={value.password} name={"Enter your password"} />
                        {err && <div className='text-red-700 text-center'>{err["password"]}</div>}
                    </div>

                    <button
                        type="submit"
                        className="bg-gradient-to-br from-[rgba(149,167,223,0.76)] to-[#326ba9] w-full text-white hover:text-blue-950 hover:bg-blue-950 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign In
                    </button>

                </form>


                <button onClick={() => setOpenModal(!openModal)} className="my-4 md:my-5 text-blue-700 text-center">
                    Forget Password?
                </button>
 
                {
                    openModal && (
                        <div className="fixed top-0 left-0 w-full h-full overflow-auto bg-black/50 z-10">
                            <ResetPassword isopen={openModal} setisOpen={setOpenModal} />
                        </div>
                    )
                }
            </div>

        </div>

    );
}

export default Page;
