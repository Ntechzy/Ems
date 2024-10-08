'use client'
import axios from "axios";
import Input from "../Input";
import toast from "react-hot-toast";
const UpdateDetail = ({ toggleDetailsModal, setBasicDetails, basicDetails,
    handleInputChange, userId, setIsDetailsModalOpen, isDetailsModalOpen,fetchUserDetailsFn
}) => {
    console.log("basicDetails dob: " , basicDetails.dob)
 

    const handleSaveDetails = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('/api/user', {
                userId, ...{
                    name: basicDetails?.firstName + " " + basicDetails?.lastName,
                    email: basicDetails?.email,
                    countryCode: '+91',
                    mobile_no: basicDetails?.phone,
                    secondaryEmail: '',
                    correspondence_address: basicDetails?.address,
                    associated_with: basicDetails?.location,
                    dob: basicDetails?.dob
                }
            })

            if (response.status === 200) {
                toast.success('Details updated successfully');
                await fetchUserDetailsFn();
            }

        } catch (error) {
            toast.error('Error updating account details:', error);
        }finally{
            document.body.style.overflow ="auto"; 
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
                        value={basicDetails.workEmail}
                        handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
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
                                value={basicDetails.firstName}
                                handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
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
                                value={basicDetails.lastName}
                                handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
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
                                value={basicDetails.countryCode}
                                handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
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
                                value={basicDetails.phoneNumber}
                                handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
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
                        value={basicDetails.location}
                        handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
                        styles={{ border: "1px solid lightgray", color: "black" }}
                        labelStyles={{ color: "gray" }}
                        inputName={"location"}
                    />

                    {/* Address */}
                    <Input
                        label="address"
                        name="Address"
                        type="text"
                        value={basicDetails.address}
                        handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
                        styles={{ border: "1px solid lightgray", color: "black" }}
                        labelStyles={{ color: "gray" }}
                        inputName={"address"}
                    />
{console.log(basicDetails.dob)}

                    <div className="flex space-x-2">
                        <Input
                            label="dob"
                            name="Date of Birth"
                            type="date"
                            value={ basicDetails.dob && basicDetails.dob != "N/A" ? new Date(basicDetails.dob).toISOString().split('T')[0]:""}
                            handleChange={(e) => handleInputChange(e, basicDetails, setBasicDetails)}
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