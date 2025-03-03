'use client';
import DeductionModal from '@/components/empl_dashboard_modal/deduction';
import { getCurrentMonth } from '@/lib/helper/GetCurrentMonth';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { SelectField } from '../EmplRegister/SelectField';
import SalarySlipDetail from './SalarySlipDetail';

const SalarySlip = () => {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const currentMonth = getCurrentMonth();
  const [isModal, setIsModal] = useState({ show: false, id: null });
  const [previewModal, setPreviewModal] = useState({ show: false, salaryData: null });
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

      <div className='w-full md:w-[90vw] overflow-x-scroll flex flex-col justify-center items-center m-auto'>
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-md">
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
              <th className="border p-2 text-left text-gray-700">Preview</th>
            </tr>
          </thead>
          <tbody>
            {data.map((obj, i) => (
              <tr key={i} className={`${i % 2 === 0 ? "bg-gray-50" : "bg-blue-50"} hover:bg-blue-100`}>
                <td className="border p-2 text-gray-800">{obj.employeeName}</td>
                <td className="border p-2 text-gray-800">{obj.basesalary}</td>
                <td className="border p-2 text-gray-800">{obj.totalDaysInMonth}</td>
                <td className="border p-2 text-gray-800">{obj.totalAbsentDays}</td>
                <td className="border p-2 text-gray-800">{obj.extraDeductionDays}</td>
                <td className="border p-2 text-gray-800">{obj.extraDeductionAmount}</td>
                <td className="border p-2 text-gray-800">{obj.salary}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setIsModal({ show: true, id: obj.employeeId })}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Deduct
                  </button>
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setPreviewModal({ show: true, salaryData: obj })}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModal.show && <DeductionModal currMonth={selectedMonth} id={isModal.id} onClose={() => setIsModal({ show: false, id: null })} />}
        {previewModal.show && <SalarySlipDetail salaryData={previewModal.salaryData} onClose={() => setPreviewModal({ show: false, salaryData: null })} />}
      </div>
    </>
  );
};

export default SalarySlip;