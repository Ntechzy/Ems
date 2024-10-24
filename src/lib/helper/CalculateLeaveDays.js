export const calculateLeaveDays = (fromDate, toDate) => {

    if (toDate < fromDate) {
        throw new Error("Invalid date range: The end date must be after the start date.");
    }
    const days = (toDate.getDate() - fromDate.getDate()) + 1;

    return days;
};

const isHolidayOrSunday = (date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0;
}

export const countLeaveDays = (fromDate, toDate) => {
    let count = 0;
    let currentDate = new Date(fromDate);
    let endDate = new Date(toDate)

    if (toDate < fromDate) {
        throw new Error("Invalid date range: The end date must be after the start date.");
    }
    while (currentDate <= endDate) {

        if (!isHolidayOrSunday(currentDate)) {
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