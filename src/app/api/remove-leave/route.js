import dbconn from "@/lib/dbconn";
import Leave from "@/modal/leave";

export async function DELETE(req) {
    await dbconn(); // Ensure the database connection is established

    try {
        const todayDate = new Date();
        const previousYear = todayDate.getFullYear() - 1;

        const monthsInPreviousYear = Array.from({ length: 12 }, (_, i) =>
            `${previousYear}-${String(i + 1).padStart(2, "0")}`
        );

        const result = await Leave.deleteMany({
            month: { $in: monthsInPreviousYear }
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: `Leave records for months in the previous year (${previousYear}) deleted successfully.`,
                deletedCount: result.deletedCount
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Something went wrong while deleting leave records.",
                error: error.message
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
