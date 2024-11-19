import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const DeductionModal = ({ currMonth, id, onClose }) => {
    const [userId, setUserId] = useState(id);
    const [month, setMonth] = useState(currMonth);
    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState("");
    console.log(month);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !month || !reason || !amount) {
            alert("All fields are required.");
            return;
        }
        try {
            const data = await axios.put("/api/admin-actions/salary", {
                userId,
                month,
                reason,
                amount,
            });
            if (data.data.success) {
                toast.success("Deduction added successfully");

            }
        } catch (error) {
            toast.error("Error in adding deduction")
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-bold mb-4">Deduction Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                            Employee ID
                        </label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Enter Employee ID"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                            Month
                        </label>
                        <input
                            type="month"
                            id="month"
                            value={month}
                            className="mt-1 p-2 w-full border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                            Reason for Deduction
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Enter reason"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Deduction Ammount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 p-2 w-full border rounded"
                            placeholder="Enter number of amount"
                            required
                            min="0"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeductionModal;
