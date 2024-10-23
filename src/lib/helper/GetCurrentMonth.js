export const getCurrentMonth = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${year}-${formattedMonth}`;
}