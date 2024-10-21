import React from 'react';
import { MdEdit } from 'react-icons/md';

const AccountDetails = ({ employee, toggleAccountModal }) => {

    return (
        <div>
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Account details</h3>
                <MdEdit
                    className="text-blue-500 text-2xl cursor-pointer"
                    onClick={toggleAccountModal}
                />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                    <p className="text-gray-500">Holder Name</p>
                    <p>{employee?.holderName}</p>
                </div>
                <div>
                    <p className="text-gray-500">Bank Name</p>
                    <p>{employee?.bankName}</p>
                </div>
                <div>
                    <p className="text-gray-500">IFSC Code</p>
                    <p>{employee?.ifscCode}</p>
                </div>
                <div>
                    <p className="text-gray-500">Account Number</p>
                    <p>{employee?.accountNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
