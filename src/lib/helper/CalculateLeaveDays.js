
export const calculateLeaveDays = (fromDate, toDate) => {
    if (toDate < fromDate) {
        throw new Error("Invalid date range: The end date must be after the start date.");
    }
    const days = (new Date(toDate).getDate() - new Date(fromDate).getDate()) + 1;
    console.log(days, "days");

    return days;
};



const isHolidayOrSunday = (date, officialOff) => {
    const dayOfWeek = date.getDay();
    const is_Off = officialOff.some(holiday =>
        new Date(holiday.date).setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)
    );

    return dayOfWeek === 0 || is_Off;
}

export const countLeaveDays = (fromDate, toDate, officialOff) => {
    let count = 0;
    let currentDate = new Date(fromDate);
    let endDate = new Date(toDate)


    if (toDate < fromDate) {
        throw new Error("Invalid date range: The end date must be after the start date.");
    }
    while (currentDate <= endDate) {
        if (!isHolidayOrSunday(currentDate, officialOff)) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
    }

    return count;
}

export const getNextMonth = (currentMonth) => {
    const [year, monthIndex] = currentMonth.split('-').map(Number);
    let nextMonthIndex = monthIndex;

    if (monthIndex === 12) {
        nextMonthIndex = 1;
    } else {
        nextMonthIndex += 1;
    }

    const nextMonth = `${nextMonthIndex < 10 ? year + '-0' + nextMonthIndex : year + '-' + nextMonthIndex}`;
    return nextMonth;
}