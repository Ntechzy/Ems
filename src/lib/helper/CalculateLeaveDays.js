export const calculateLeaveDays = (fromDate, toDate) => {

    if (toDate < fromDate) {
        throw new Error("Invalid date range: The end date must be after the start date.");
    }
    const days = (toDate.getDate() - fromDate.getDate()) + 1;

    return days;
};

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