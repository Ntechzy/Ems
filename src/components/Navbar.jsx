'use client'
import React from 'react'
import { IoLogOut } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { data: session, status } = useSession()
    return (
        <>
            {
                session &&
                <div className="bg-[#114061] text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="text-yellow-500 text-2xl font-bold mr-4">Ntechzy</div>
                            <div className="text-xl font-semibold">EMS</div>
                        </div>

                        {session && (session?.user.role === "admin" || session?.user.role === "super_admin") &&
                            <div className="hidden md:flex items-center space-x-8">
                                <Link href="/all-employees" className="text-gray-200 hover:text-white">EMPLOYEES</Link>
                                <Link href="/tickets" className="text-gray-200 hover:text-white uppercase">Raised Ticket</Link>
                                <Link href="/" className="text-gray-200 hover:text-white uppercase">Offer Letter</Link>
                                <Link href="/" className="text-gray-200 hover:text-white uppercase">Birth Date</Link>
                                <Link href="/leave" className="text-gray-200 hover:text-white uppercase">Leave</Link>
                            </div>
                        }


                        <div className='flex justify-center items-center gap-6'>
                            <div className='flex flex-col justify-center items-center'>
                                <IoLogOut onClick={() => signOut()} className="fas fa-cog text-gray-200 hover:text-white text-xl md:text-4xl" />

                            </div>
                            <Link href={"/"} className="flex items-center space-x-4">
                                <img src="https://img.freepik.com/free-photo/beautiful-male-half-length-portrait-isolated-white-studio-background-young-emotional-hindu-man-blue-shirt-facial-expression-human-emotions-advertising-concept-standing-smiling_155003-25250.jpg?w=826&t=st=1727176643~exp=1727177243~hmac=d883f4c6ab692bb09bd6684c8e42efc270bca8adb3487e5b4b5a5eaaaf36fab3" alt="Profile picture of a person" className="rounded-full w-10 h-10" />
                            </Link>
                        </div>
                        <div className="md:hidden">
                            <GiHamburgerMenu onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none" />
                        </div>
                    </div>
                    {session && (session?.user.role === "admin" || session?.user.role === "super_admin") && isOpen && (
                        <div className="md:hidden mt-4 space-y-2 flex flex-col gap-2">
                            <Link href="/all-employees" className="text-gray-200 hover:text-white">EMPLOYEES</Link>
                            <Link href="/tickets" className="text-gray-200 hover:text-white uppercase">Raised Ticket</Link>
                            <Link href="/" className="text-gray-200 hover:text-white uppercase">Offer Letter</Link>
                            <Link href="/" className="text-gray-200 hover:text-white uppercase">Birth Date</Link>
                            <Link href="/leave" className="text-gray-200 hover:text-white uppercase">Leave</Link>
                        </div>
                    )}
                </div>}
        </>
    );
}

export default Navbar;