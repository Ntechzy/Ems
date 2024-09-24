'use client'
import React from 'react'
import { IoSettings } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="bg-[#114061] text-white p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-yellow-500 text-2xl font-bold mr-4">Ntechzy</div>
                    <div className="text-xl font-semibold">EMS</div>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-gray-200 hover:text-white">EMPLOYEES</a>
                    <a href="#" className="text-gray-200 hover:text-white">HARDWARE</a>
                    <a href="#" className="text-gray-200 hover:text-white">SOFTWARE</a>
                    <a href="#" className="text-gray-200 hover:text-white">PROJECTS</a>
                </div>
                <div className="flex items-center space-x-4">
                    <IoSettings className="fas fa-cog text-gray-400 hover:text-white text-xl md:text-2xl" />
                    <img src="https://img.freepik.com/free-photo/beautiful-male-half-length-portrait-isolated-white-studio-background-young-emotional-hindu-man-blue-shirt-facial-expression-human-emotions-advertising-concept-standing-smiling_155003-25250.jpg?w=826&t=st=1727176643~exp=1727177243~hmac=d883f4c6ab692bb09bd6684c8e42efc270bca8adb3487e5b4b5a5eaaaf36fab3" alt="Profile picture of a person" className="rounded-full w-10 h-10"/>
                </div>
                <div className="md:hidden">
                    <GiHamburgerMenu onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white focus:outline-none"/>
                        
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden mt-4 space-y-2">
                    <a href="#" className="block text-gray-400 hover:text-white">EMPLOYEES</a>
                    <a href="#" className="block text-gray-400 hover:text-white">HARDWARE</a>
                    <a href="#" className="block text-gray-400 hover:text-white">SOFTWARE</a>
                    <a href="#" className="block text-gray-400 hover:text-white">PROJECTS</a>
                </div>
            )}
        </div>
    );
}

export default Navbar;