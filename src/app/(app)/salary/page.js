'use client';
import { SelectField } from '@/components/EmplRegister/SelectField';
import { getCurrentMonth } from '@/lib/helper/GetCurrentMonth';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const SalaryPage = () => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [deductMode, setDeductMode] = useState(null); // Tracks active deduction mode
    const [deductionDays, setDeductionDays] = useState({}); // Stores deduction days by employee ID

    const allMonths = Array.from({ length: +selectedMonth.split('-')[1] }, (_, i) =>
        `${selectedMonth.split('-')[0]}-${String(i + 1).padStart(2, '0')}`
    ).reverse();

    useEffect(() => {
        axios
            .get(`/api/admin-actions/salary?month=${selectedMonth}`)
            .then((response) => setData(response.data.results))
            .catch(() => toast.error('Error fetching employee data'));
    }, [selectedMonth]);

    const handleDeduction = async (employeeId) => {
        const days = deductionDays[employeeId];
        if (!days || days <= 0) {
            toast.error('Please enter valid deduction days.');
            return;
        }
        try {
            await axios.post(`/api/admin-actions/deduct`, { employeeId, days });
            toast.success(`Deduction of ${days} days saved.`);
            setDeductMode(null);
        } catch {
            toast.error('Error saving deduction.');
        }
    };

    return (
        <div className="flex flex-col gap-10 my-5">
            <SelectField
                label="Select Month:"
                options={allMonths}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                id="month-select"
                defaultOption="Please select a month"
            />
            <table className="min-w-full border border-gray-200">
                <thead>
                    <tr>
                        <th className="border p-2">Employee Name</th>
                        <th className="border p-2">Absent Days</th>
                        <th className="border p-2">Salary</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ employeeId, employeeName, totalAbsentDays, salary }) => (
                        <tr key={employeeId}>
                            <td className="border p-2">{employeeName}</td>
                            <td className="border p-2">{totalAbsentDays}</td>
                            <td className="border p-2">{salary}</td>
                            <td className="border p-2">
                                {deductMode === employeeId ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="number"
                                            value={deductionDays[employeeId] || ''}
                                            onChange={(e) =>
                                                setDeductionDays((prev) => ({
                                                    ...prev,
                                                    [employeeId]: +e.target.value,
                                                }))
                                            }
                                            placeholder="Deduction days"
                                            className="p-1 border rounded w-full"
                                        />
                                        <button
                                            onClick={() => handleDeduction(employeeId)}
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            OK
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setDeductMode(employeeId)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        Deduct
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalaryPage;
