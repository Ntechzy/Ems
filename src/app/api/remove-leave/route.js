
export async function DELETE(req) {
    await dbconn()
    try {
        const todayDate = new Date();
        const previousMonth = todayDate.getMonth() - 1;
        const year = todayDate.getFullYear();

        const StartOfPreviousMonth = new Date(year, previousMonth, 1);
        const EndOfPreviousMonth = new Date(year, previousMonth + 1, 0);
        const firstDayOfCurrentMonth = new Date(year, previousMonth + 1, 1);
        await Leave.deleteMany({
            leaveFrom: { $gte: StartOfPreviousMonth, $lte: EndOfPreviousMonth },
            leaveTo: { $gte: StartOfPreviousMonth, $lt: firstDayOfCurrentMonth }
        });

        return Response.json({
            success: true,
            message: "Previous month's leave records deleted successfully"
        }, { status: 200 })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Something Went Wrong",
            error: error
        }, { status: 500 })
    }
}