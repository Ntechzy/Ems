import React from 'react';

const JobDetails = ({ employee }) => {
    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800">Job details</h3>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-4">
                <div>
                    <p className="text-gray-500">ID</p>
                    <p>{employee?.employeeID}</p>
                </div>
                <div>
                    <p className="text-gray-500">Job Title</p>
                    <p>{employee?.jobTitle}</p>
                </div>
                <div>
                    <p className="text-gray-500">Employee Type</p>
                    <p>{employee?.employeeType}</p>
                </div>
                <div>
                    <p className="text-gray-500">Start Date ( MM/DD/YY )</p>
                    <p>{employee?.startDate}</p>
                </div>
                <div>
                    <p className="text-gray-500">Department</p>
                    <p>{employee?.department}</p>
                </div>
                <div>
                    <p className="text-gray-500">Salary Slot</p>
                    <p>{employee?.salarySlot}</p>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
