"use client";
import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaTicketAlt, FaUserSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import LeaveModal from "@/components/empl_dashboard_modal/LeaveModal";
import RaiseTicket from "@/components/empl_dashboard_modal/RaiseTicket";
import UpdateDetail from "@/components/empl_dashboard_modal/UpdateDetail";
import ShowLeaves from "@/components/empl_dashboard_modal/ShowLeaves";
import Link from "next/link";
import AccountModal from "@/components/empl_dashboard_modal/AccountModal";
import BasicDetails from "@/components/empl_dashboard_component/BasicDetails";
import JobDetails from "@/components/empl_dashboard_component/JobDetails";
import AccountDetails from "@/components/empl_dashboard_component/AccountDetails";
import HardwareAssigned from "@/components/empl_dashboard_component/HardwareAssigned";
import SoftwareLicenses from "@/components/empl_dashboard_component/SoftwareLicenses";
import { deactivateUser, fetchUserDetails } from "../empl_dashboard_function/FetchUserDetail";
import { getCurrentMonth } from "@/lib/helper/GetCurrentMonth";
import WarningMail from "../empl_dashboard_modal/WarningMail";
import { set } from "mongoose";
import QrCode from "../empl_dashboard_component/QrCodeImage";
import QrCodeCmp from "../empl_dashboard_component/QrCodeImage";
import SalarySlip from "../SalarySlip/SalarySlip";

const Dashboard = ({ userId }) => {
    const [leaveFormErrors, setLeaveFormErrors] = useState({});
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Employees");
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] = useState(false);
    const [employee, setEmployee] = useState();
    const [isUpdatePass, setisUpdatePass] = useState(false);
    const [loading, setLoading] = useState(true);

    const { data: session, status } = useSession();
    const [leaveDetails, setLeaveDetails] = useState({
        leaveType: "",
        managerToAsk: "",
        startDate: "",
        endDate: "",
        reason: "",
    });

    const [accountDetails, setAccountDetails] = useState({
        holderName: employee?.accountDetails.holderName,
        bank_name: employee?.accountDetails.bankName,
        ifsc_code: employee?.accountDetails.ifscCode,
        account_number: employee?.accountDetails.accountNumber,
    });

    const [basicDetails, setBasicDetails] = useState({
        firstName: employee?.firstName,
        lastName: employee?.lastName,
        workEmail: employee?.email,
        countryCode: "+91",
        phoneNumber: employee?.phone,
        secondaryEmail: "",
        address: employee?.address,
        location: employee?.location,
        dob: employee?.dob,
        pan_card_no: employee?.pan_card_no,
        aadhaar_no: employee?.aadhaar_no,
        designation: employee?.designation,
    });



    const handleInputChange = (
        e,
        detailsObj = leaveDetails,
        setFn = setLeaveDetails
    ) => {
        const { name, value } = e.target;
        setFn({ ...detailsObj, [name]: value });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const toggleLeaveModal = () => {
        window.scrollTo({ top: 0 });
        setIsLeaveModalOpen(!isLeaveModalOpen);
        document.body.style.overflow = !isLeaveModalOpen ? "hidden" : "auto";
    };

    const toggleTicketModal = () => {
        window.scrollTo({ top: 0 });
        setIsTicketModalOpen(!isTicketModalOpen);
        document.body.style.overflow = !isTicketModalOpen ? "hidden" : "auto";
    };
    const toggleHandleWarning = () => {
        window.scrollTo({ top: 0 });
        setIsWarningModalOpen(!isWarningModalOpen);
        document.body.style.overflow = !isWarningModalOpen ? "hidden" : "auto";
    };

    const toggleDetailsModal = () => {
        window.scrollTo({ top: 0 });
        setIsDetailsModalOpen(!isDetailsModalOpen);
        document.body.style.overflow = !isDetailsModalOpen ? "hidden" : "auto";
    };

    const toggleAccountModal = () => {
        window.scrollTo({ top: 0 });
        setIsAccountDetailsModalOpen(!isAccountDetailsModalOpen);
        document.body.style.overflow = !isAccountDetailsModalOpen
            ? "hidden"
            : "auto";
    };

    const getData = async (userId) => {
        try {
            const data = await fetchUserDetails(userId)

            setEmployee(data);


            setBasicDetails({
                firstName: data?.firstName,
                lastName: data?.lastName,
                workEmail: data?.email,
                countryCode: "+91",
                phoneNumber: data?.phone,
                secondaryEmail: "",
                address: data?.address,
                location: data?.location,
                dob: data?.dob,
                pan_card_no: data?.pan_No,
                aadhaar_no: data?.aadhaarNo,
                designation: data?.jobTitle,
            });
            setAccountDetails({
                holderName: data?.accountDetails.holderName,
                bankName: data?.accountDetails.bankName,
                ifscCode: data?.accountDetails.ifscCode,
                accountNumber: data?.accountDetails.accountNumber,
            });

            // console.log(basicDetails.designation, "employee");
        } catch (err) {
            toast.error("Something Went Wrong ")
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            getData(userId);
        }
    }, [userId]);

    return (
        <div
            className={`bg-gray-100 min-h-screen  md:p-6 p-2 ${(loading || !employee) && "flex justify-center items-center"
                }`}
        >
            {loading ? (
                <Loader />
            ) : employee ? (
                <>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex justify-between items-center flex-col gap-4 md:gap-0 md:flex-row">
                            {/* Profile Info */}
                            <div className="flex items-center">
                                <img
                                    src={employee?.profilePicture}
                                    alt="Profile"
                                    className="rounded-full w-20 h-20 mr-4 object-cover"
                                />
                                <div>
                                    <h2 className="text-2xl font-semibold">{employee?.name}</h2>
                                    <p className="text-gray-500">{employee?.jobTitle}</p>
                                    <p className="text-sm text-gray-400">{basicDetails?.workEmail}</p>
                                    <p className="text-gray-500">
                                        Location: {basicDetails?.location}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 items-center text-sm md:text-base gap-4">
                                <Link href={"/birthdays"}>
                                    <button className="bg-yellow-500 w-full text-white py-1 md:py-2 px-3 md:px-4 rounded">
                                        BirthDays 🎂
                                    </button>
                                </Link>
                                {(session?.user?.role === "admin" || session?.user?.role === "super_admin") &&
                                    employee?.status == "Active" && (
                                        <>
                                            <button onClick={() => deactivateUser(employee.user_id)} className="bg-red-500 text-white py-1 md:py-2 px-3 md:px-4 rounded">
                                                Discontinue
                                            </button>

                                            <button className="bg-red-500 text-white py-1 md:py-2 px-3 md:px-4 rounded" onClick={toggleHandleWarning}>
                                                Send Warning
                                            </button>

                                        </ >
                                    )
                                }

                                {(
                                    session?.user?.role == "user" && session?.user?.id != userId
                                ) ? (
                                    null
                                ) : <>
                                    <button
                                        onClick={toggleLeaveModal}
                                        className="bg-button_blue text-white p-2 md:py-2  md:px-4 rounded mr-4 flex gap-2 items-center "
                                    >
                                        <span className="md:flex hidden">
                                            <FaRegCalendarAlt />
                                        </span>
                                        Apply Leave
                                    </button>
                                    <button
                                        onClick={toggleTicketModal}
                                        className="bg-yellow-600 text-white py-1 md:py-2 px-3 md:px-4 rounded flex gap-2 items-center"
                                    >
                                        <span className="md:flex hidden">
                                            <FaTicketAlt />
                                        </span>
                                        Raise Ticket
                                    </button>
                                </>}
                            </div>
                        </div>
                        {/* Manager, Department, and Status */}
                        <div className="mt-4 md:flex md:items-center md:space-x-5 space-y-2 md:space-y-0 text-sm md:text-base">
                            <div>
                                <span className="text-gray-600">Manager: </span>
                                <span className="font-semibold">{employee?.manager}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Department: </span>
                                <span className="font-semibold">{employee?.department}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Designation: </span>
                                <span className="font-semibold">{employee?.jobTitle}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Status: </span>
                                <span
                                    className={`text-white font-semibold p-1  md:mt-0 md:p-2 rounded ${employee?.status === "Active"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                        }`}
                                >
                                    {employee?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                        <ul className="flex border-b overflow-auto">
                            {["Employees", "Hardware", "Software", "Leave", "Id Card"].map((tab) => (
                                <li key={tab} className="mr-6">
                                    <button
                                        onClick={() => handleTabClick(tab)}
                                        className={`py-2 px-4 font-semibold ${activeTab === tab
                                            ? "text-blue-500 border-b-2 border-blue-500"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                        {activeTab === "Employees" && (
                            <>
                                <BasicDetails
                                    employee={basicDetails}
                                    toggleDetailsModal={toggleDetailsModal}
                                    isUpdatePass={isUpdatePass}
                                    setisUpdatePass={setisUpdatePass}
                                />

                                <JobDetails employee={employee} />

                                <AccountDetails employee={accountDetails} toggleAccountModal={toggleAccountModal} />
                            </>
                        )}
                        {activeTab === "Hardware" && <HardwareAssigned employee={employee} />}
                        {activeTab === "Software" && <SoftwareLicenses employee={employee} />}
                        {activeTab === "Leave" && <ShowLeaves month={getCurrentMonth()} id={userId} />}
                        {activeTab === "Id Card" && <QrCodeCmp employee={employee} id={userId} />}
                        {/* {activeTab === "Salary Slip" && <SalarySlip employee={employee} id={userId} />} */}
                    </div>

                    {isLeaveModalOpen && (
                        <LeaveModal
                            toggleLeaveModal={toggleLeaveModal}
                            handleInputChange={handleInputChange}
                            setLeaveFormErrors={setLeaveFormErrors}
                            leaveDetails={leaveDetails}
                            userId={userId}
                            leaveFormErrors={leaveFormErrors}
                        />
                    )}

                    {isTicketModalOpen && (
                        <RaiseTicket toggleTicketModal={toggleTicketModal} />
                    )}
                    {isWarningModalOpen && (
                        <WarningMail toggleHandleWarning={toggleHandleWarning} id={userId} />
                    )}

                    {isDetailsModalOpen && (
                        <UpdateDetail
                            toggleDetailsModal={toggleDetailsModal}
                            setBasicDetails={setBasicDetails}
                            basicDetails={basicDetails}
                            userId={userId}
                            setIsDetailsModalOpen={setIsDetailsModalOpen}
                        />
                    )}

                    {isAccountDetailsModalOpen && (
                        <AccountModal
                            toggleAccountModal={toggleAccountModal}
                            accountDetails={accountDetails}
                            userId={userId}
                            setAccountDetails={setAccountDetails} />
                    )}
                </>
            ) : (
                <div class="bg-gray-100 p-4 rounded-md shadow-md flex flex-col items-center justify-center text-5xl gap-4">
                    <div class="text-gray-400 text-5xl mr-4 self-start">
                        <FaUserSlash />
                    </div>
                    <div class="flex-1">
                        <h2 class="font-bold m-0 text-[#114061]">No user found</h2>
                        <p class="text-gray-600 text-sm md:text-xl">
                            We couldn&apos;t find any users matching your search criteria.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;