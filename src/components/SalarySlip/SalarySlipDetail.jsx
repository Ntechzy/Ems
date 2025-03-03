'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SalarySlipDetail = ({ salaryData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    if (!salaryData) return null;

    const handleSendMail = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = {
                name: salaryData.employeeName,
                month: salaryData.month,
                baseSalary: salaryData.basesalary,
                totalAbsentDays: salaryData.totalAbsentDays,
                extraDeductionAmount: salaryData.extraDeductionAmount,
                salary: salaryData.salary,
                reason: salaryData.deductedReason,
                employeeId: salaryData.employeeId

            }


            const response = await fetch('/api/admin-actions/salary/send-mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send the salary slip.');
            }

            toast.success('Salary slip sent successfully!');
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-lg border border-gray-300">
                <div className="text-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Salary Slip</h2>
                    <p className="text-gray-600 text-sm">Confidential Document</p>
                </div>

                <div className="mb-4">
                    <p className="text-lg font-semibold">Employee Details</p>
                    <div className="grid grid-cols-2 gap-4 border-b pb-3">
                        <p><strong>Name:</strong> {salaryData.employeeName}</p>
                        <p><strong>Month:</strong> {salaryData.month}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-lg font-semibold">Earnings</p>
                    <div className="grid grid-cols-2 gap-4 border-b pb-3">
                        <p><strong>Base Salary:</strong> ₹{salaryData.basesalary}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-lg font-semibold">Deductions</p>
                    <div className="grid grid-cols-2 gap-4 border-b pb-3">
                        <p><strong>Absent Days:</strong> {salaryData.totalAbsentDays}</p>
                        <p><strong>Extra Deduction Amount:</strong> ₹{salaryData.extraDeductionAmount}</p>
                        <p><strong>Extra Deduction Reason:</strong>{salaryData.deductedReason}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-lg font-semibold">Net Pay</p>
                    <div className="grid grid-cols-2 gap-4 border-b pb-3">
                        <p><strong>Final Salary:</strong> ₹{salaryData.salary}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded w-full font-semibold"
                    >
                        Close
                    </button>

                    <button
                        onClick={handleSendMail}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded w-full font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Salary Slip'}
                    </button>
                </div>

                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default SalarySlipDetail;
