'use client';

import ShowLeaves from "@/components/empl_dashboard_modal/ShowLeaves";
import { SelectField } from "@/components/EmplRegister/SelectField";
import { getCurrentMonth } from "@/lib/helper/GetCurrentMonth";
import React, { useState } from "react";
const LeaveTable = () => {
    const currentMonth = getCurrentMonth();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const allMonths = getMonthsUntilCurrent(currentMonth).reverse();

    function getMonthsUntilCurrent(month) {
        const [year, monthNum] = month.split('-').map(Number);
        return Array.from({ length: monthNum }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
    }

    return (
        <div className="flex flex-col m-10 md:mx-20 lg:mx-32">
            <SelectField
                label="Select Month:"
                options={allMonths}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                id="month-select"
                defaultOption="Please select a month"
            />
            <ShowLeaves showAllLeaves={true} month={selectedMonth} />
        </div>
    );
};

export default LeaveTable;
