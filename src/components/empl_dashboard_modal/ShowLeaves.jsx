'use client'

import axios from "axios";
import { useEffect, useState } from "react";
import Input from "../Input";
import { useSession } from "next-auth/react";
import { DateIstConvert } from "@/lib/DateIstConvert";
import toast from "react-hot-toast";
import { handleResponse } from "@/lib/helper/YupResponseHandler";
import { getNextMonth } from "@/lib/helper/CalculateLeaveDays";

const ShowLeaves = ({ showAllLeaves = false, month, id }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [leaveData, setLeaveData] = useState([]);
    const [leaveCount, setLeaveCount] = useState({
        casual: 0,
        absent: 0,
        shortLeave: 0,
        disapproved: 0
    })
    const { data: session, status } = useSession()

    useEffect(() => {
        const fetchLeaveData = async () => {

            try {
                if (!session || !session.user) {
                    return;
                }

                let url = '';

                if (showAllLeaves && (session?.user?.role === "admin" || session?.user?.role === "super_admin")) {
                    console.log("a");

                    url = `/api/apply-leave?view=all&month=${month}`;
                } else {
                    console.log(id);

                    url = `/api/apply-leave?userId=${id}&month=${month}`;
                }

                const response = await axios.get(url);
                console.log(response.data.leave)
                const transformedData = response.data.leave.map(leave => ({
                    id: leave._id,
                    name: leave.user?.name || "Unknown ! Connect To IT Team",
                    leaveFrom: leave.leaveFrom,
                    leaveTo: leave.leaveTo,
                    leaveType: leave.leaveType,
                    requestedTo: leave.RequestedTo,
                    isApproved: leave.isApproved,
                    leaveId: leave.leaveId,
                }));
                console.log(transformedData);

                const sortedData = transformedData.sort((a, b) => {
                    if (a.isApproved === null && b.isApproved !== null) return -1;
                    if (a.isApproved !== null && b.isApproved === null) return 1;
                    return 0;
                });


                const disapproved = transformedData.filter((obj) => obj.isApproved === false)

                setLeaveData(sortedData);
                if (response.data.leave.length > 0) {
                    setLeaveCount({
                        casual: response.data.leave[0].totalCasualDays,
                        absent: response.data.leave[0].totalAbsentDays,
                        shortLeave: response.data.leave[0].totalShortLeave,
                        disapproved: disapproved.length
                    })
                }

            } catch (error) {
                toast.error("Something went wrong");
            }
        }

        fetchLeaveData()
    }, [session, status, showAllLeaves, month])


    const filteredData = leaveData.filter((leave) =>
        leave.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filteredData);

    const handleApproval = async (action, leaveId, requestedTo) => {
        try {
            const response = await axios.put('/api/apply-leave', {
                leave_id: leaveId,
                requested_to: requestedTo,
                is_approved: action,
            });

            handleResponse(response)
        } catch (error) {
            toast.error(error.message)
        }
    };


    const renderLeaveSummary = () => (
        <div className="bg-gray-100 shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Leave Summary</h2>
            <div className="flex flex-col space-y-3">
                {Object.entries(leaveCount).map(([key, value]) => {
                    const bgColor = key === 'casual' ? 'bg-green-200' : key === 'absent' ? 'bg-red-200' : 'bg-blue-200';
                    const hoverBgColor = key === 'casual' ? 'hover:bg-green-300' : key === 'absent' ? 'hover:bg-red-300' : 'hover:bg-blue-300';
                    const textColor = key === 'casual' ? 'text-green-800' : key === 'absent' ? 'text-yellow-800' : 'text-blue-800';

                    return (
                        <div key={key} className={`flex justify-between ${bgColor} rounded-md p-3 ${hoverBgColor} transition duration-200`}>
                            <span className="font-medium text-gray-700">Total {key.charAt(0).toUpperCase() + key.slice(1)} Leave:</span>
                            <span className={`font-semibold ${textColor}`}>
                                {value}
                                {key === 'casual' ? '/12' : key === 'shortLeave' ? '/24' : ''}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="">

            {!showAllLeaves && renderLeaveSummary()}

            <div className="flex md:flex-row flex-col my-5 items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Leave List</h2>
                <div className="flex justify-center   m-auto flex-col">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-bold">From:</span>
                        <span className="">{month}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-bold">To:</span>
                        <span className="">{getNextMonth(month)}</span>
                    </div>
                </div>
            </div>

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
                        <tr className="bg-blue-500 text-white text-center">
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
                                <tr key={index} className="border-t border-blue-300 bg-blue-100 hover:bg-blue-200 ">
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
                                                onClick={() => handleApproval("Approve", leave.leaveId, leave.requestedTo)}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleApproval("Remove", leave.leaveId, leave.requestedTo)}
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