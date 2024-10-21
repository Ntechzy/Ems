import axiosRequest from "@/lib/axios";

export const fetchUserDetails = async (userId) => {
    try {
        const res = await axiosRequest.get(`/user/${userId}`);

        if (res.status !== 200) {
            throw new Error('Error fetching user details');
        }
        
        const userDetails = await res.data.data

        const employee = {
            profilePicture:
                userDetails.profile_photo?.cloud_url ||
                "https://img.freepik.com/free-photo/beautiful-male-half-length-portrait-isolated-white-studio-background-young-emotional-hindu-man-blue-shirt-facial-expression-human-emotions-advertising-concept-standing-smiling_155003-25250.jpg?w=826&t=st=1727176643~exp=1727177243~hmac=d883f4c6ab692bb09bd6684c8e42efc270bca8adb3487e5b4b5a5eaaaf36fab3",
            user_id: userDetails?.user_id?._id,
            name: userDetails?.user_id?.name,
            type: userDetails?.user_id?.role,
            jobTitle: userDetails?.user_id?.designation,
            email: userDetails?.user_id?.email,
            location: userDetails.user_id.associated_with || "N/A",
            manager: userDetails.manager || "N/A",
            department: userDetails?.user_id?.department?.name,
            status: userDetails.status ? "Active" : "Inactive",
            firstName: userDetails?.user_id?.name.split(" ")[0],
            lastName: userDetails?.user_id?.name.split(" ")[1] || "",
            phone: userDetails?.user_id?.mobile_no,
            address: userDetails.correspondence_address || "N/A",
            employeeID: userDetails?.user_id?.employee_id,
            employeeType: "Permanent",
            startDate: userDetails.date_of_joining
                ? new Date(userDetails.date_of_joining).toLocaleDateString()
                : "N/A",
            salarySlot: userDetails.salary_slot || "N/A",
            dob: userDetails.dob
                ? new Date(userDetails.dob.date).toISOString()
                : "N/A",
            accountDetails: {
                holderName: userDetails.account_holder_name || "N/A",
                bankName: userDetails.bank_name || "N/A",
                ifscCode: userDetails.ifsc_code || "N/A",
                accountNumber: userDetails.account_number || "N/A",
            },
            hardware:
                userDetails.alloted_hardwares?.map((hardware) => ({
                    name: hardware.name,
                    model: hardware.model || "N/A",
                })) || [],
            software:
                userDetails.alloted_softwares?.map((software) => ({
                    name: software.name,
                    version: software.version || "N/A",
                })) || [],
        };

        return employee;
    } catch (err) {
        console.error(err);
    }
};
