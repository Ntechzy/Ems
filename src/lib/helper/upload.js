import cloudinary from "@/lib/cloudinary/cloudinary"; // Ensure this is your Cloudinary config

export const uploadToCloudinary = async (fileBuffer, folderPath) => {
    console.log("File being uploaded:", fileBuffer);

    try {
        // Get the size of the file buffer
        const totalSize = fileBuffer.length;

        // Upload file buffer directly
        const result = await cloudinary.v2.uploader.upload(
            `data:image/png;base64,${fileBuffer.toString("base64")}`, // Convert buffer to base64 format with MIME type
            {
                folder: folderPath,
                // resource_type: "auto", // Uncomment if needed
            }
        );

        // Log the result and return necessary data
        console.log("Upload successful:", result);
        return {
            public_id: result.public_id,
            url: result.secure_url,
        };
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        throw error; // Rethrow the error for further handling
    }
};
