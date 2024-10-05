import { leaveValidation } from "@/Validation/LeaveValidation";

const LeaveModal = ({ toggleLeaveModal, setLeaveFormErrors, handleInputChange, leaveDetails, leaveFormErrors }) => {

    const validateForm = async () => {
        try {
            await leaveValidation.validate(leaveDetails, { abortEarly: false });
            setLeaveFormErrors({});
            return true;
        } catch (validationErrors) {
            const formErrors = {};
            validationErrors.inner.forEach((error) => {
                formErrors[error.path] = error.message;
            });
            setLeaveFormErrors(formErrors);
            return false;
        }
    };

    const handleApplyLeave = async (e) => {
        e.preventDefault();

        const isValid = await validateForm();

        if (isValid) {
            console.log('Leave Details:', leaveDetails);
            toggleLeaveModal();
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
                            <option value="sick">Sick Leave</option>
                            <option value="casual">Casual Leave</option>
                        </select>
                        {leaveFormErrors.leaveType && (
                            <div className="text-red-500 text-sm">{leaveFormErrors.leaveType}</div>
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
                    <button onClick={handleApplyLeave} className="bg-button_blue text-white py-2 px-4 rounded">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeaveModal