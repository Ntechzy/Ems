'use client'
import axios from "axios";
import Input from "../Input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
const UpdateDetail = ({ toggleDetailsModal, setBasicDetails, basicDetails,
    userId, setIsDetailsModalOpen
}) => {
    const [localDetails, setLocalDetails] = useState(basicDetails);

    useEffect(() => {
        setLocalDetails(basicDetails);
    }, [basicDetails]);

    const handleInputChangeLocal = (e) => {
        const { name, value } = e.target;
        setLocalDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSaveDetails = async (e) => {
        e.preventDefault();

        try {
            setBasicDetails(localDetails);
            const response = await axios.put('/api/user', {
                userId, ...{
                    name: localDetails?.firstName + " " + localDetails?.lastName,
                    email: localDetails?.email,
                    countryCode: '+91',
                    mobile_no: localDetails?.phone,
                    secondaryEmail: '',
                    correspondence_address: localDetails?.address,
                    associated_with: localDetails?.location,
                    dob: localDetails?.dob
                }
            })

            if (response.status === 200) {
                toast.success('Details updated successfully');
            }

        } catch (error) {
            toast.error('Error updating account details:', error);
        } finally {
            document.body.style.overflow = "auto";
            setIsDetailsModalOpen(false);
        }
    };

    return (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50 bg-[#00000088]" onClick={toggleDetailsModal}>
            <div className="bg-white p-4 my-2 rounded-lg shadow-md w-[90%] md:w-[40%]" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
                <h2 className="text-2xl font-semibold mb-3">Edit Basic Details</h2>
                <hr />
                {/* Form for Basic Details */}
                <form onSubmit={handleSaveDetails} className='mt-4'>
                    {/* Work Email */}
                    <Input
                        label="work-email"
                        name="Work Email"
                        type="email"
                        value={localDetails.workEmail}
                        handleChange={handleInputChangeLocal}
                        styles={{ border: "1px solid lightgray", color: "black" }}
                        labelStyles={{ color: "gray" }}
                        inputName={"workEmail"}
                    />

                    <div className="flex space-x-2">
                        {/* First Name */}
                        <div className="w-1/2">
                            <Input
                                label="first-name"
                                name="First Name"
                                type="text"
                                value={localDetails.firstName}
                                handleChange={handleInputChangeLocal}
                                styles={{ border: "1px solid lightgray", color: "black" }}
                                labelStyles={{ color: "gray" }}
                                inputName={"firstName"}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="w-1/2">

                            <Input
                                label="last-name"
                                name="Last Name"
                                type="text"
                                value={localDetails.lastName}
                                handleChange={handleInputChangeLocal}
                                styles={{ border: "1px solid lightgray", color: "black" }}
                                labelStyles={{ color: "gray" }}
                                inputName={"lastName"}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        {/* Country Code */}
                        <div className="w-1/2">
                            <Input
                                label="country-code"
                                name="Country Code"
                                type="text"
                                value={localDetails.countryCode}
                                handleChange={handleInputChangeLocal}
                                styles={{ border: "1px solid lightgray", color: "black" }}
                                labelStyles={{ color: "gray" }}
                                inputName={"countryCode"}
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="w-1/2">
                            <Input
                                label="phone-number"
                                name="Phone Number"
                                type="text"
                                value={localDetails.phoneNumber}
                                handleChange={handleInputChangeLocal}
                                styles={{ border: "1px solid lightgray", color: "black" }}
                                labelStyles={{ color: "gray" }}
                                inputName={"phoneNumber"}
                            />
                        </div>
                    </div>


                    {/* Location */}
                    <Input
                        label="location"
                        name="Location"
                        type="text"
                        value={localDetails.location}
                        handleChange={handleInputChangeLocal}
                        styles={{ border: "1px solid lightgray", color: "black" }}
                        labelStyles={{ color: "gray" }}
                        inputName={"location"}
                    />

                    {/* Address */}
                    <Input
                        label="address"
                        name="Address"
                        type="text"
                        value={localDetails.address}
                        handleChange={handleInputChangeLocal}
                        styles={{ border: "1px solid lightgray", color: "black" }}
                        labelStyles={{ color: "gray" }}
                        inputName={"address"}
                    />
                    <div className="flex space-x-2">
                        <Input
                            label="dob"
                            name="Date of Birth"
                            type="date"
                            value={localDetails.dob && localDetails.dob != "N/A" ? new Date(localDetails.dob).toISOString().split('T')[0] : ""}
                            handleChange={handleInputChangeLocal}
                            styles={{ border: "1px solid lightgray", color: "black" }}
                            labelStyles={{ color: "gray" }}
                            inputName={"dob"}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end mt-3">
                        <button
                            type="button"
                            onClick={toggleDetailsModal}
                            className="bg-gray-300 text-gray-700 py-2 px-3 rounded mr-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-button_blue text-white py-2 px-3 rounded text-sm"
                        >
                            Save Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateDetail