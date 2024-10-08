'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import Input from "../Input";
import { useSession } from "next-auth/react";
import { DateIstConvert } from "@/lib/DateIstConvert";
import toast from "react-hot-toast";
import { handleResponse } from "@/lib/helper/YupResponseHandler";

const ShowLeaves = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [leaveData, setLeaveData] = useState([]); 
    useEffect(() => {
        const fetchLeaveData = async () => {
            try {
                const response = await axios.get('/api/apply-leave')
                const transformedData = response.data.leave.map(leave => ({
                    id: leave._id,
                    name: leave.result[0]?.name || "Unknown ! Connect To IT Team",
                    leaveFrom: leave.leaveFrom,
                    leaveTo: leave.leaveTo,
                    leaveType: leave.leaveType,
                    requestedTo: leave.RequestedTo,
                    isApproved: leave.isApproved
                }));
                setLeaveData(transformedData);

            } catch (error) {
                toast.error("Something went wrong")
            }
        }

        fetchLeaveData()
    }, [])

    const filteredData = leaveData.filter((leave) =>
        leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { data: session, status } = useSession()


    const handleApproval = async (action, leaveId, requestedTo) => {
        try {
            const response = await axios.put('/api/apply-leave', {
                leave_id: leaveId,
                requested_to: requestedTo,
                is_approved: action,
            });

            handleResponse(response)
            window.location.reload()
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className="mx-4 my-6 p-4">

            <div className="mb-4">
                <Input
                    label="search"
                    handleChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    name={"Search By Name"}

                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-blue-50 border border-blue-300 shadow-lg rounded-lg">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Leave From</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Leave To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Leave Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((leave, index) => (
                                <tr key={index} className="border-t border-blue-300 bg-blue-100 hover:bg-blue-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{leave.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{DateIstConvert(leave.leaveFrom)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{DateIstConvert(leave.leaveTo)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">{leave.leaveType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                                        {leave.isApproved === null ?
                                            <span className="text-yellow-600">Pending...</span> :
                                            (!leave.isApproved ?
                                                <span className="text-red-600">Disapproved</span>
                                                :
                                                <span className="text-green-600">Approved</span>)}
                                    </td>

                                    {
                                        session && session?.user?.role === "admin" && leave.requestedTo === session?.user?.id && leave.isApproved == null &&
                                        <td className="flex ">
                                            <button
                                                onClick={() => handleApproval("Approve", leave.id, leave.requestedTo)}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleApproval("Remove", leave.id, leave.requestedTo)}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    }
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-blue-600">No records found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default ShowLeaves