'use client';
import { getCurrentMonth } from '@/lib/helper/GetCurrentMonth';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { SelectField } from '../EmplRegister/SelectField';
import DeductionModal from '@/modal/deduction';
import toast from 'react-hot-toast';

const SalarySlip = () => {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const currentMonth = getCurrentMonth();
  const [isModal, setIsModal] = useState({
    show: false,
    id: null
  })
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const allMonths = getMonthsUntilCurrent(currentMonth).reverse();

  function getMonthsUntilCurrent(month) {
    const [year, monthNum] = month.split('-').map(Number);
    return Array.from({ length: monthNum }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
  }


  useEffect(() => {
    axios.get(`/api/admin-actions/salary?month=${selectedMonth}`)
      .then((response) => setData(response.data.results))
      .catch(() => toast.error('Error fetching employee data'));
  }, [selectedMonth]);

  const printSlip = () => {
    const printContent = document.getElementById('salary-slip').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;

    window.print();

    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <>

      <SelectField
        label="Select Month:"
        options={allMonths}
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        id="month-select"
        defaultOption="Please select a month"
      />
      {/* Card for User */}
      {
        data ?
          session?.user?.role === 'user' ? (

            <div className="max-w-lg mx-auto p-6 bg-gray-50 shadow-lg rounded-lg border border-gray-200 text-start" id="salary-slip">
              {data.map((obj, i) => (
                <div key={i}>
                  <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Salary Slip</h2>

                  <div className="mb-6">
                    <p className="text-lg text-gray-700"><strong>Employee Name:</strong> {obj.employeeName}</p>
                  </div>

                  <div className="mb-6 p-4 rounded-lg bg-blue-50 shadow-inner">
                    <h3 className="font-semibold text-lg text-blue-700 mb-2">Attendance Details</h3>
                    <div className="flex justify-between">
                      <p><strong>Total Days:</strong></p>
                      <p>{obj.totalDaysInMonth}</p>
                    </div>
                    <div className="flex justify-between">
                      <p><strong>Absent Days:</strong></p>
                      <p>{obj.totalAbsentDays}</p>
                    </div>
                  </div>

                  <div className="mb-6 p-4 rounded-lg bg-green-50 shadow-inner">
                    <h3 className="font-semibold text-lg text-green-700 mb-2">Salary Details</h3>
                    <div className="flex justify-between">
                      <p><strong>Basic Salary:</strong></p>
                      <p>{obj.basesalary}</p>
                    </div>
                    <div className="flex justify-between">
                      <p><strong>Total Salary:</strong></p>
                      <p>{obj.salary}</p>
                    </div>
                  </div>

                  <div className="mb-6 p-4 rounded-lg bg-red-50 shadow-inner">
                    <h3 className="font-semibold text-lg text-red-700 mb-2">Deductions</h3>
                    <div className="flex justify-between">
                      <p><strong>Absent Days Deduction:</strong></p>
                      <p>{obj.totalAbsentDays}</p>
                    </div>
                    <div className="flex justify-between">
                      <p><strong>Extra Deducted Days:</strong></p>
                      <p>{obj.extraDeductionDays}</p>
                    </div>
                    <div className="flex justify-between">
                      <p><strong>Extra Deducted Salary:</strong></p>
                      <p>{obj.extraDeductionAmount}</p>
                    </div>
                    <div className="flex justify-between">
                      <p><strong>Reason for Extra Deductions:</strong></p>
                      <p>{obj.deductedReason || "N/A"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p><strong>Total Deductions:</strong></p>
                      <p>{obj.basesalary - obj.salary}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-yellow-50 shadow-inner">
                    <p className="text-lg font-bold text-yellow-700 flex justify-between">
                      <span><strong>Paid Salary:</strong></span>
                      <span>{obj.salary}</span>
                    </p>
                  </div>

                  <div className="flex justify-center mt-8">
                    <button
                      onClick={printSlip}
                      className="py-2 px-6 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
                    >
                      Print Salary Slip
                    </button>
                  </div>
                </div>
              ))}
            </div>

          ) : (
            <div className='w-full md:w-[90vw] overflow-x-scroll flex  flex-col justify-center items-center m-auto'>

              <table className="min-w-full border border-gray-200 overflow-x-auto bg-white shadow-md rounded-md">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border p-2 text-left text-gray-700">Employee Name</th>
                    <th className="border p-2 text-left text-gray-700">Actual Salary</th>
                    <th className="border p-2 text-left text-gray-700">Month</th>
                    <th className="border p-2 text-left text-gray-700">Absent Days</th>
                    <th className="border p-2 text-left text-gray-700">Extra Deduction Day</th>
                    <th className="border p-2 text-left text-gray-700">Extra Deduction Amount</th>
                    <th className="border p-2 text-left text-gray-700">Calculated Salary</th>
                    <th className="border p-2 text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((obj, i) => (
                    <tr
                      key={i}
                      className={`${i % 2 === 0 ? "bg-gray-50" : "bg-blue-50"
                        } hover:bg-blue-100`}
                    >
                      <td className="border p-2 text-gray-800">{obj.employeeName}</td>
                      <td className="border p-2 text-gray-800">{obj.basesalary}</td>
                      <td className="border p-2 text-gray-800">{obj.totalDaysInMonth}</td>
                      <td className="border p-2 text-gray-800">{obj.totalAbsentDays}</td>
                      <td className="border p-2 text-gray-800">{obj.extraDeductionDays}</td>
                      <td className="border p-2 text-gray-800">{obj.extraDeductionAmount}</td>
                      <td className="border p-2 text-gray-800">{obj.salary}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => setIsModal({
                            show: true,
                            id: obj.employeeId
                          })}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          Deduct
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {
                isModal.show && <DeductionModal currMonth={selectedMonth} id={isModal.id} onClose={() => setIsModal({
                  show: false,
                  id: null
                })} />
              }

            </div>

          )
          : "Loading"}


    </>
  );
};

export default SalarySlip;
