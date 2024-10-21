import { useEffect, useState } from "react";
import Input from "../Input"
import toast from "react-hot-toast";
import axios from "axios";


const AccountModal = ({ toggleAccountModal,
    accountDetails, userId,
    setAccountDetails }) => {

    const [localDetails, setLocalDetails] = useState(accountDetails);

    useEffect(() => {
        setLocalDetails(accountDetails);
    }, [accountDetails]);

    const handleInputChangeLocal = (e) => {
        const { name, value } = e.target;
        setLocalDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSaveAccountDetails = async (e) => { 

        e.preventDefault();

        try {
            console.log("local change", localDetails);
            setAccountDetails(localDetails)

            const response = await axios.put('/api/user', {
                userId, ...{
                    account_holder_name: localDetails.holderName,
                    bank_name: localDetails?.bankName,
                    ifsc_code: localDetails?.ifscCode,
                    account_number: localDetails?.accountNumber,
                }
            })

            console.log(response);

            if (response.status === 200) {
                toast.success('Account Details updated successfully', { position: "top-center" });
            }
        } catch (error) {
            console.log(error);

        } finally {
            toggleAccountModal();
        }
    };

    return (
        <div
            className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50 bg-[#00000088]"
            onClick={toggleAccountModal}
        >
            <div
                className="bg-white p-4 my-2 rounded-lg shadow-md w-[90%] md:w-[40%]"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: "90vh" }}
            >
                <h2 className="text-2xl font-semibold mb-3">
                    Edit Account Details
                </h2>
                <hr />
                {/* Form for Account Details */}
                <form onSubmit={handleSaveAccountDetails} className="mt-4">
                    {/* Holder Name */}
                    <Input
                        label="holder-name"
                        name="Holder Name"
                        type="text"
                        value={localDetails.holderName}
                        handleChange={handleInputChangeLocal}
                        styles={{ border: "1px solid lightgray", color: "black" }}
                        labelStyles={{ color: "gray" }}
                        inputName={"holderName"}
                    />

                    {/* Bank Name */}
                    <Input
                        label="bank-name"
                        name="Bank Name"
                        type="text"
                        value={localDetails.bankName}
                        handleChange={handleInputChangeLocal}
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
                                value={localDetails.ifscCode}
                                handleChange={handleInputChangeLocal
                                }
                                styles={{
                                    border: "1px solid lightgray",
                                    color: "black",
                                }}
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
                                value={localDetails.accountNumber}
                                handleChange={handleInputChangeLocal}
                                styles={{
                                    border: "1px solid lightgray",
                                    color: "black",
                                }}
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
    )
}

export default AccountModal