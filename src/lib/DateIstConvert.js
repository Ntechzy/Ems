export const DateIstConvert = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}