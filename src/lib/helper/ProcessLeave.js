import Leave from "@/modal/leave";
import { countLeaveDays } from "./CalculateLeaveDays";
import ExtraLeave from "@/modal/extrasLeave";

export async function processLeave(userId, month, fromDate, toDate, leaveType, managerToAsk, reason) {
    const formattedMonth = month.split('-');
    if (formattedMonth[1].length === 1) {
        formattedMonth[1] = formattedMonth[1].padStart(2, '0');
    }
    const formattedMonthString = `${formattedMonth[0]}-${formattedMonth[1]}`;


    let leaveDoc = await Leave.findOne({ user: userId, month }) || new Leave({
        user: userId,
        month: formattedMonthString,
        casualDays: 0,
        absentDays: 0,
        deducted: {
            days: 0,
            reason: null
        },
        shortDays: 0,
        leaveDetails: []
    });

    const officialOff = await ExtraLeave.find({})
    const leaveDays = countLeaveDays(fromDate, toDate, officialOff);

    if (leaveType === 'casual') {
        if (leaveDoc.casualDays !== 0) {
            throw new Error("You have already taken your casual leave for this month.");
        }
        if (leaveDays > 1) {
            throw new Error(`You requested for ${leaveDays} days but your organization only allows 1 casual leave per month.`);
        }
        leaveDoc.casualDays = 1;
    } else if (leaveType === 'short') {
        if (leaveDoc.shortDays >= 2) {
            throw new Error("You have already taken two short leaves this month.");
        }

        if (leaveDays > 1) {
            throw new Error(`You requested for ${leaveDays} days but you can only avail short leave for one day`);
        }
        leaveDoc.shortDays += 1;
    } else {
        leaveDoc.absentDays += leaveDays
    }


    leaveDoc.leaveDetails.push({
        leaveType,
        leaveFrom: fromDate,
        leaveTo: toDate,
        reason,
        requestedDays: leaveDays,
        RequestedTo: managerToAsk,
        isApproved: null
    });

    await leaveDoc.save();
}
