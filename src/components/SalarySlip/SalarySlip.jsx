// src/SalarySlip.js
import { useSession } from 'next-auth/react';
import React from 'react';

const SalarySlip = ({
  employeeName,
  employeeId,
  totalDays,
  absentDays,
  shortLeave,
  basicSalary,
  allowances,
}) => {
  // Get session data
  const { data: session } = useSession();

  // Calculate total salary
  const totalSalary = basicSalary + allowances;

  // Deduction calculations
  const absentDaysDeduction = (totalSalary / totalDays) * absentDays;
  const shortLeaveDeduction = (totalSalary / totalDays) * shortLeave;

  // Total deductions
  const totalDeductions = absentDaysDeduction + shortLeaveDeduction;

  // Paid Salary
  const paidSalary = totalSalary - totalDeductions;

  // Function to print the salary slip
  const printSlip = () => {
    const printContent = document.getElementById('salary-slip').innerHTML;
    const originalContent = document.body.innerHTML;

    // Replace the body content with the salary slip for printing
    document.body.innerHTML = printContent;

    window.print();

    // Restore original content after printing
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore event listeners and state
  };

  return (
    <>
    <div className="max-w-md mx-auto p-6 bg-gray-50 shadow-lg rounded-lg border border-gray-200 text-start" id="salary-slip">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Salary Slip</h2>
      <div className="mb-4">
        <p className="text-gray-600"><strong>Employee Name:</strong> {session.user.username}</p>
        <p className="text-gray-600"><strong>Employee ID:</strong> {session.user.id}</p>
      </div>
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h3 className="font-semibold text-gray-700">Attendance Details</h3>
        <p><strong>Total Days:</strong> {totalDays}</p>
        <p><strong>Absent Days:</strong> {absentDays}</p>
        <p><strong>Short Leave Days:</strong> {shortLeave}</p>
      </div>
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h3 className="font-semibold text-gray-700">Salary Details</h3>
        <p><strong>Basic Salary:</strong> ${basicSalary}</p>
        {/* <p><strong>Allowances:</strong> ${allowances}</p> */}
        <p><strong>Total Salary:</strong> ${totalSalary}</p>
      </div>
      <div className="mb-4 border-b border-gray-300 pb-2">
        <h3 className="font-semibold text-gray-700">Deductions</h3>
        <p><strong>Absent Days Deduction:</strong> -${absentDaysDeduction.toFixed(2)}</p>
        <p><strong>Short Leave Deduction:</strong> -${shortLeaveDeduction.toFixed(2)}</p>
        <p><strong>Total Deductions:</strong> -${totalDeductions.toFixed(2)}</p>
      </div>
      <div className="mt-4 border-t pt-4 text-left">
        <p className="text-lg font-bold text-gray-800"><strong>Paid Salary:</strong> ${paidSalary.toFixed(2)}</p>
      </div>
    </div>
    
    <div className="flex justify-center mt-6">
      <button
        onClick={printSlip}
        className="py-2 px-6 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
        >
        Print Salary Slip
      </button>
    </div>
          </>
  );
};

export default SalarySlip;
