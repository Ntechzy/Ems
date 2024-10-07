"use client";
import React, { useEffect, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { FaRegCalendarAlt, FaTicketAlt, FaUserSlash } from "react-icons/fa";
import Input from '@/components/Input';

import axiosRequest from '@/lib/axios';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import axios from 'axios';
import UpdatePassword from '@/components/UpdatePassword';
import toast from 'react-hot-toast';
import LeaveModal from '@/components/empl_dashboard_modal/LeaveModal';
import RaiseTicket from '@/components/empl_dashboard_modal/RaiseTicket';
import UpdateDetail from '@/components/empl_dashboard_modal/UpdateDetail';
// pankaj removed leave form schema 

const EmployeeProfile = ({ params }) => {
    const [leaveFormErrors, setLeaveFormErrors] = useState({});
    const [activeTab, setActiveTab] = useState('Employees');
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] = useState(false);
    const [employee, setEmployee] = useState();
    const [isUpdatePass, setisUpdatePass] = useState(false)
    const [loading , setLoading] = useState(true);
    const userId = params.empId;
    const { data: session, status } = useSession()
    const [leaveDetails, setLeaveDetails] = useState({
        leaveType: '',
        managerToAsk: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

    const [accountDetails, setAccountDetails] = useState({
        holderName: employee?.accountDetails.holderName,
        bank_name: employee?.accountDetails.bankName,
        ifsc_code: employee?.accountDetails.ifscCode,
        account_number: employee?.accountDetails.accountNumber
    });

    const handleSaveDetails = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('/api/user', {userId,...{
                name: basicDetails?.firstName + " " + basicDetails?.lastName,
                  email: basicDetails?.email,
                //   countryCode: '+91',
                  mobile_no: basicDetails?.phone,
                //   secondaryEmail: '',
                  correspondence_address: basicDetails?.address,
                  associated_with: basicDetails?.location,
                  dob: basicDetails?.dob
              }})
      
            if (response.status === 200) {
                toast.success('Details updated successfully' , {position:"top-center"});
                await fetchUserDetails(userId);
            }

        } catch (error) {
            console.error('Error updating account details:', error);
        }finally{
            toggleDetailsModal()
        }
    };


    const handleSaveAccountDetails = async (e) => {
        e.preventDefault();

        try {
            console.log(accountDetails)
            const response = await axios.put('/api/user', {userId,...{
                account_holder_name: accountDetails.holderName,
                  bank_name: accountDetails?.bankName,
                  ifsc_code: accountDetails?.ifscCode,
                  account_number: accountDetails?.accountNumber,
              }})
              if(response.status === 200) {
                toast.success('Account Details updated successfully' , {position:"top-center"});
                await fetchUserDetails(userId);
              }
        } catch (error) {
            console.error('Error updating account details:', error);
        }finally{
            toggleAccountModal();
        }
    };

    const [basicDetails, setBasicDetails] = useState({
        firstName: employee?.firstName,
        lastName: employee?.lastName,
        workEmail: employee?.email,

        countryCode: '+91',
        phoneNumber: employee?.phone,
        secondaryEmail: '',
        address: employee?.address,
        location: employee?.location,
        dob: employee?.dob
    });



    const handleInputChange = (e, detailsObj = leaveDetails, setFn = setLeaveDetails) => {
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
    
    const toggleDetailsModal = () => {
        window.scrollTo({ top: 0 });
        setIsDetailsModalOpen(!isDetailsModalOpen);
        document.body.style.overflow = !isDetailsModalOpen ? "hidden" : "auto"; 
    };
    
    const toggleAccountModal = () => {
        window.scrollTo({ top: 0 });
        setIsAccountDetailsModalOpen(!isAccountDetailsModalOpen);
        document.body.style.overflow = !isAccountDetailsModalOpen ? "hidden" : "auto"; 
    };

    const fetchUserDetails = async (userId) => {
        try {
            setLoading(true);
            const res = await axiosRequest.get(`/user/${userId}`);
            const userDetails = res.data.data;
            console.log(userDetails);

            const employee = {
                profilePicture:
                    userDetails.profile_photo?.cloud_url ||
                    "https://img.freepik.com/free-photo/beautiful-male-half-length-portrait-isolated-white-studio-background-young-emotional-hindu-man-blue-shirt-facial-expression-human-emotions-advertising-concept-standing-smiling_155003-25250.jpg?w=826&t=st=1727176643~exp=1727177243~hmac=d883f4c6ab692bb09bd6684c8e42efc270bca8adb3487e5b4b5a5eaaaf36fab3",
                user_id: userDetails?.user_id?._id,
                name: userDetails?.user_id?.name,
                type: userDetails?.user_id?.role,
                jobTitle: userDetails?.user_id?.designation,
                email: userDetails?.user_id?.email,
                location: userDetails.user_id.associated_with || "N/A",
                manager: userDetails.manager || "N/A",
                department: userDetails?.user_id?.department?.name,
                status: userDetails.status ? "Active" : "Inactive",
                firstName: userDetails?.user_id?.name.split(" ")[0],
                lastName: userDetails?.user_id?.name.split(" ")[1] || "",
                phone: userDetails?.user_id?.mobile_no,
                address: userDetails.correspondence_address || "N/A",
                employeeID: userDetails?.user_id?.employee_id,
                employeeType: "Permanent",
                startDate: userDetails.date_of_joining
                    ? new Date(userDetails.date_of_joining).toLocaleDateString()
                    : "N/A",
                salarySlot: userDetails.salary_slot || "N/A",
                dob: userDetails.dob ? new Date(userDetails.dob.date).toISOString() : "N/A",
                accountDetails: {
                    holderName: userDetails.account_holder_name || "N/A",
                    bankName: userDetails.bank_name || "N/A",
                    ifscCode: userDetails.ifsc_code || "N/A",
                    accountNumber: userDetails.account_number || "N/A",
                },
                hardware: userDetails.alloted_hardwares?.map((hardware) => ({
                    name: hardware.name,
                    model: hardware.model || "N/A",
                })) || [],
                software: userDetails.alloted_softwares?.map((software) => ({
                    name: software.name,
                    version: software.version || "N/A",
                })) || [],
            };
            setEmployee(employee);
            setBasicDetails({
                firstName: employee?.firstName,
                lastName: employee?.lastName ,
                workEmail: employee?.email,
                countryCode: '+91',
                phoneNumber: employee?.phone,
                secondaryEmail: '',
                address: employee?.address,
                location: employee?.location,
                dob: employee?.dob
            });
            setAccountDetails({
                holderName: employee?.accountDetails.holderName,
                bankName: employee?.accountDetails.bankName,
                ifscCode: employee?.accountDetails.ifscCode,
                accountNumber: employee?.accountDetails.accountNumber
            })

            return employee;
        } catch (err) {
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    const handleApplyLeave = async()=>{

    }

    useEffect(() => {
        fetchUserDetails(userId);
    }, [])

    return (
        <div className={`bg-gray-100 min-h-screen p-6 ${(loading || !employee) && "flex justify-center items-center"}`}>
            {
                loading ? <Loader/>:
                employee ?
            <>
                {/* Profile Header */}
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
                                <p className="text-sm text-gray-400">{employee?.email}</p>
                                <p className="text-gray-500">Location: {employee?.location}</p>
                            </div>
                        </div>
                        <div className="flex text-sm md:text-base gap-4">
                            {(session?.user?.role === "admin" && employee?.status == "Active") && <button className="bg-red-500 text-white py-1 md:py-2 px-3 md:px-4 rounded">Discontinue</button>}

                            {
                                !(session?.user?.role == 'admin' && session?.user?.id != userId) ?
                                    <>
                                        <button onClick={toggleLeaveModal} className="bg-button_blue text-white py-1 md:py-2 px-3 md:px-4 rounded mr-4 flex gap-2 items-center">
                                            <FaRegCalendarAlt />
                                            Apply Leave
                                        </button>
                                        <button onClick={toggleTicketModal} className="bg-yellow-600 text-white py-1 md:py-2 px-3 md:px-4 rounded flex gap-2 items-center">
                                            <FaTicketAlt />
                                            Raise Ticket
                                        </button>

                                    </> : null
                            }
                        </div>
                    </div>
                    {/* Manager, Department, and Status */}
                    <div className="mt-4 flex space-x-4 text-sm md:text-base">
                        <div>
                            <span className="text-gray-600">Manager: </span>
                            <span className="font-semibold">{employee?.manager}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Department: </span>
                            <span className="font-semibold">{employee?.department}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">Status: </span>
                            <span className={`text-white font-semibold p-1  md:mt-0 md:p-2 rounded ${employee?.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {employee?.status}
                            </span>
                        </div>
                    </div>
                </div>



                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                    <ul className="flex border-b overflow-auto">
                        {['Employees', 'Hardware', 'Software'].map(tab => (
                            <li key={tab} className="mr-6">
                                <button
                                    onClick={() => handleTabClick(tab)}
                                    className={`py-2 px-4 font-semibold ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    {activeTab === 'Employees' && (
                        <>
                            {/* Basic Details */}
                            <div>

                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">Basic details</h3>
                                    <div className='flex gap-5 justify-center items-center'>
                                        <MdEdit className="text-blue-500 text-2xl cursor-pointer" onClick={toggleDetailsModal} />
                                        <button onClick={() => setisUpdatePass(!isUpdatePass)} className=' bg-button_blue  p-3 text-white rounded-lg'>Update Password</button>
                                    </div>

                                    {
                                        isUpdatePass && <div className='fixed top-0 left-0 w-full h-full overflow-auto bg-black/50 z-10'>
                                            < UpdatePassword isopen={isUpdatePass} setisOpen={setisUpdatePass} />
                                        </div>
                                    }
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
                                        <p>{employee?.phone}</p>
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
                                        <p>{(new Date(basicDetails?.dob))?.toLocaleDateString()}</p>
                                    </div>
                                </div>

                            </div>

                            {/* Job Details */}
                            <div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">Job details</h3>
                                    {/* <MdEdit className="text-blue-500 text-2xl cursor-pointer" /> */}
                                </div>
                                <div className="grid grid-cols-2 gap-6 mt-4">
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
                                        <p className="text-gray-500">Start Date</p>
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

                            {/* Account Details */}
                            <div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold text-gray-800">Account details</h3>
                                    <MdEdit className="text-blue-500 text-2xl cursor-pointer" onClick={toggleAccountModal} />
                                </div>
                                <div className="grid grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <p className="text-gray-500">Holder Name</p>
                                        <p>{employee?.accountDetails.holderName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Bank Name</p>
                                        <p>{employee?.accountDetails.bankName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">IFSC Code</p>
                                        <p>{employee?.accountDetails.ifscCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Account Number</p>
                                        <p>{employee?.accountDetails.accountNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {activeTab === 'Hardware' && (
                        <div className="bg-white p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">Hardware Assigned</h3>
                            <ul className="mt-4 space-y-4 text-base">
                                {employee?.hardware.map((item, index) => (
                                    <li key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50 hover:bg-white transition-all duration-200 ease-in-out shadow-sm hover:shadow-md">
                                        <span className="font-bold text-indigo-600">{item.name}:</span>
                                        <span className="text-gray-700">{item.model}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {activeTab === 'Software' && (
                        <div className="bg-white p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-200">Software Licenses</h3>
                            <ul className="mt-4 space-y-4 text-base">
                                {employee?.software.map((item, index) => (
                                    <li key={index} className="flex gap-4 p-4 rounded-lg border bg-gray-50 hover:shadow-md transition-shadow">
                                        <span className="font-bold text-button_blue">{item.name}:</span>
                                        <span className="text-gray-700">{item.version}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Apply Leave Modal */}
                {isLeaveModalOpen && (
                    <LeaveModal toggleLeaveModal={toggleLeaveModal}
                        handleInputChange={handleInputChange}
                        setLeaveFormErrors={setLeaveFormErrors}
                        leaveDetails={leaveDetails}
                        leaveFormErrors={leaveFormErrors}
                        handleApplyLeave={handleApplyLeave} />
                )}

                {/* Raise Ticket Modal */}
                {isTicketModalOpen && (
                    <RaiseTicket toggleTicketModal={toggleTicketModal} />

                )}

                {/* Edit Details Modal */}
                {isDetailsModalOpen && (
                    <UpdateDetail toggleDetailsModal={toggleDetailsModal}
                        basicDetails={basicDetails}
                        handleInputChange={handleInputChange}
                        setBasicDetails={setBasicDetails}
                        userId={userId}
                        handleSaveDetails={handleSaveDetails}
                        setIsDetailsModalOpen={setIsDetailsModalOpen}
                        isDetailsModalOpen={isDetailsModalOpen} 
                        fetchUserDetailsFn = {()=>fetchUserDetails(userId)}
                        />
                        
                )}

                {/* Account Details Modal */}
                {isAccountDetailsModalOpen && (
                    <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50 bg-[#00000088]" onClick={toggleAccountModal}>
                        <div className="bg-white p-4 my-2 rounded-lg shadow-md w-[90%] md:w-[40%]" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
                            <h2 className="text-2xl font-semibold mb-3">Edit Account Details</h2>
                            <hr />
                            {/* Form for Account Details */}
                            <form onSubmit={handleSaveAccountDetails} className="mt-4">

                                {/* Holder Name */}
                                <Input
                                    label="holder-name"
                                    name="Holder Name"
                                    type="text"
                                    value={accountDetails.holderName}
                                    handleChange={(e) => handleInputChange(e, accountDetails, setAccountDetails)}
                                    styles={{ border: "1px solid lightgray", color: "black" }}
                                    labelStyles={{ color: "gray" }}
                                    inputName={"holderName"}
                                />

                                {/* Bank Name */}
                                <Input
                                    label="bank-name"
                                    name="Bank Name"
                                    type="text"
                                    value={accountDetails.bankName}
                                    handleChange={(e) => handleInputChange(e, accountDetails, setAccountDetails)}
                                    styles={{ border: "1px solid lightgray", color: "black" }}
                                    labelStyles={{ color: "gray" }}
                                    inputName={"bankName"}
                                />

                                <div className="flex space-x-2">
                                    {/* IFSC Code */}
                                    <div className="w-1/2">
                                        <Input
                                            label="ifsc-code"
                                            name="IFSC Code"
                                            type="text"
                                            value={accountDetails.ifscCode}
                                            handleChange={(e) => handleInputChange(e, accountDetails, setAccountDetails)}
                                            styles={{ border: "1px solid lightgray", color: "black" }}
                                            labelStyles={{ color: "gray" }}
                                            inputName={"ifscCode"}
                                        />
                                    </div>

                                    {/* Account Number */}
                                    <div className="w-1/2">
                                        <Input
                                            label="account-number"
                                            name="Account Number"
                                            type="text"
                                            value={accountDetails.accountNumber}
                                            handleChange={(e) => handleInputChange(e, accountDetails, setAccountDetails)}
                                            styles={{ border: "1px solid lightgray", color: "black" }}
                                            labelStyles={{ color: "gray" }}
                                            inputName={"accountNumber"}
                                        />
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-end mt-3">
                                    <button
                                        type="button"
                                        onClick={toggleAccountModal}
                                        className="bg-gray-300 text-gray-700 py-2 px-3 rounded mr-2 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-button_blue text-white py-2 px-3 rounded text-sm"
                                    >
                                        Save Account Details
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}
            </>:
            <div class="bg-gray-100 p-4 rounded-md shadow-md flex flex-col items-center justify-center text-5xl gap-4">
                <div class="text-gray-400 text-5xl mr-4 self-start">
                    <FaUserSlash/>
                </div>
                <div class="flex-1">
                    <h2 class="font-bold m-0 text-[#114061]">No user found</h2>
                    <p class="text-gray-600 text-sm md:text-xl">We couldn't find any users matching your search criteria.</p>
                </div>
            </div>

            }

        </div>
    );
};

export default EmployeeProfile;
