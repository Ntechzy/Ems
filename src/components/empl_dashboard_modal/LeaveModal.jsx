'use client'
import { leaveValidation } from "@/Validation/LeaveValidation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { handleError, handleResponse } from "@/lib/helper/YupResponseHandler";


const LeaveModal = ({ toggleLeaveModal, setLeaveFormErrors, handleInputChange, leaveDetails, leaveFormErrors }) => {

    const [manager, setManager] = useState()
    const [isSubmiting, setisSubmiting] = useState(false)
    const getManagerName = async () => {
        try {
            const data = await axios.get('/api/department-managers')
            setManager(data.data.department)
        } catch (error) {
            toast.error(error.response.message ? error.response.message : "Something Went wrong... ||  Please Try Again")
        }
    }


    useEffect(() => {
        getManagerName()
    }, [])


    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            await leaveValidation.validate(leaveDetails, { abortEarly: false });

            setisSubmiting(true)
            const response = await axios.post('/api/apply-leave', leaveDetails)

            handleResponse(response)
            toggleLeaveModal();
            setisSubmiting(false)

            return true;
        } catch (error) {
            const formErrors = handleError(error)
            setLeaveFormErrors(formErrors);
            setisSubmiting(false)
            return false;
        }
    };
    return (
        <div
            className="absolute top-0 bottom-0 left-0 right-0 flex items-start justify-center z-50 bg-[#00000088] "
            onClick={toggleLeaveModal}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-md absolute top-[50vh] translate-y-[-50%] w-[90%] md:w-[40%]"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">Apply Leave</h2>

                <form className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Leave Type</label>
                        <select
                            name="leaveType"
                            value={leaveDetails.leaveType}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        >
                            <option value="" disabled>Select Leave Type</option>
                            <option value="absent">Absent</option>
                            <option value="casual">Casual Leave</option>
                            <option value="sick">Sick Leave</option>
                        </select>
                        {leaveFormErrors.leaveType && (
                            <div className="text-red-500 text-sm">{leaveFormErrors.leaveType}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700">Select You Manager </label>
                        <select
                            name="managerToAsk"
                            value={leaveDetails.managerToAsk}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        >
                            <option value="" disabled>Select Manager</option>
                            {
                                manager && manager.manager && manager.manager.length > 0 && (
                                    manager.manager.map((item, index) => (
                                        <option key={index} value={item._id}>{item.name}</option>
                                    ))

                                )
                            }

                        </select>
                        {leaveFormErrors.leaveType && (
                            <div className="text-red-500 text-sm">{leaveFormErrors.managerToAsk}</div>
                        )}
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-gray-700">Leave From</label>
                        <input
                            type="date"
                            name="startDate"
                            value={leaveDetails.startDate}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {leaveFormErrors.startDate && (
                            <div className="text-red-500 text-sm">{leaveFormErrors.startDate}</div>
                        )}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block text-gray-700">Leave To</label>
                        <input
                            type="date"
                            name="endDate"
                            value={leaveDetails.endDate}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                        />
                        {leaveFormErrors.endDate && (
                            <div className="text-red-500 text-sm">{leaveFormErrors.endDate}</div>
                        )}
                    </div>

                    {/* Reason for Leave */}
                    <div>
                        <label className="block text-gray-700">Reason</label>
                        <textarea
                            name="reason"
                            value={leaveDetails.reason}
                            onChange={handleInputChange}
                            className="w-full mt-1 p-2 border rounded"
                            rows="3"
                            placeholder="Enter reason for leave"
                        ></textarea>
                        {leaveFormErrors.reason && (
                            <div className="text-red-500 text-sm">{leaveFormErrors.reason}</div>
                        )}
                    </div>
                </form>

                {/* Buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                    <button onClick={toggleLeaveModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button disabled={isSubmiting} onClick={handleApplyLeave} className="bg-button_blue text-white py-2 px-4 rounded">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeaveModal