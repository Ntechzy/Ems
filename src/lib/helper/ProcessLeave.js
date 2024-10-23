import Leave from "@/modal/leave";
import { calculateLeaveDays } from "./CalculateLeaveDays";

export async function processLeave(userId, month, fromDate, toDate, leaveType, managerToAsk, reason, leaveStatus) {
    let leaveDoc = await Leave.findOne({ user: userId, month }) || new Leave({
        user: userId,
        month,
        casualDays: 0,
        absentDays: 0,
        shortDays: 0,
        leaveDetails: [],
        autoApprovedDate: null
    });
    const leaveDays = calculateLeaveDays(fromDate, toDate);

    if (leaveType === 'casual') {
        if (leaveDoc.casualDays !== 0) {
            throw new Error("You have already taken your casual leave for this month.");
        }
        if (leaveDays > 1) {
            throw new Error(`You requested for ${leaveDays} days but your organization only allows 1 casual leave per month.`);
        }
        leaveDoc.casualDays = 1;
        leaveStatus.casualLeaveAutoApproved = true;
        leaveStatus.approvedDays.push(fromDate.toISOString().split('T')[0]);
        leaveDoc.autoApprovedDate = fromDate;
    } else if (leaveType === 'short') {
        if (leaveDoc.shortDays >= 2) {
            throw new Error("You have already taken two short leaves this month.");
        }

        if (leaveDays > 1) {
            throw new Error(`You requested for ${leaveDays} days but you can only avail short leave for one day`);
        }
        leaveDoc.shortDays += 1;

    } else {
        leaveDoc.absentDays += leaveDays - (leaveDoc.casualDays > 0 ? 0 : 1);
        if (leaveDoc.casualDays === 0) {
            leaveDoc.casualDays = 1;
            leaveStatus.casualLeaveAutoApproved = true;
            leaveDoc.autoApprovedDate = fromDate;

            leaveStatus.approvedDays.push(fromDate.toISOString().split('T')[0]);
        }
    }


    leaveDoc.leaveDetails.push({
        leaveType,
        leaveFrom: fromDate,
        leaveTo: toDate,
        reason,
        RequestedTo: managerToAsk,
        isApproved: leaveType === 'casual' ? true : null
    });

    await leaveDoc.save();
}
