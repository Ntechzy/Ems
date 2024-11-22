import dbconn from "@/lib/dbconn";
import Leave from "@/modal/leave";

export async function DELETE(req) {
    await dbconn(); // Ensure the database connection is established

    try {
        const todayDate = new Date();
        const previousYear = todayDate.getFullYear() - 1;

        // Format months for the previous year (e.g., "2023-01", "2023-02", ...)
        const monthsInPreviousYear = Array.from({ length: 12 }, (_, i) =>
            `${previousYear}-${String(i + 1).padStart(2, "0")}`
        );

        // Delete documents where the `month` matches any month in the previous year
        const result = await Leave.deleteMany({
            month: { $in: monthsInPreviousYear }
        });

        // Return a success response with the count of deleted records
        return new Response(
            JSON.stringify({
                success: true,
                message: `Leave records for months in the previous year (${previousYear}) deleted successfully.`,
                deletedCount: result.deletedCount
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        // Return an error response if something goes wrong
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
