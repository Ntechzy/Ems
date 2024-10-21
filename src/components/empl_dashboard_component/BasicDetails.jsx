import React from 'react';
import { MdEdit } from 'react-icons/md';
import UpdatePassword from '../UpdatePassword';

const BasicDetails = ({ employee, toggleDetailsModal, isUpdatePass, setisUpdatePass }) => {
    return (
        <div>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Basic details</h3>
                <div className="flex gap-5 justify-center items-center">

                    <MdEdit
                        className="text-blue-500 text-2xl cursor-pointer"
                        onClick={toggleDetailsModal}
                    />

                    <button
                        onClick={() => setisUpdatePass(!isUpdatePass)}
                        className="bg-button_blue p-1 md:p-3 text-white rounded-lg"
                    >
                        Update Password
                    </button>

                </div>

                {isUpdatePass && (
                    <div className="fixed top-0 left-0 w-full h-full overflow-auto bg-black/50 z-10">
                        <UpdatePassword
                            isopen={isUpdatePass}
                            setisOpen={setisUpdatePass}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                    <p className="text-gray-500">First name</p>
                    <p>{employee?.firstName}</p>
                </div>
                <div>
                    <p className="text-gray-500">Last name</p>
                    <p>{employee?.lastName}</p>
                </div>
                <div>
                    <p className="text-gray-500">Phone</p>
                    <p>{employee?.phoneNumber}</p>
                </div>
                <div>
                    <p className="text-gray-500">Location</p>
                    <p>{employee?.location}</p>
                </div>
                <div>
                    <p className="text-gray-500">Address</p>
                    <p>{employee?.address}</p>
                </div>
                <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p>{new Date(employee?.dob).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default BasicDetails;
