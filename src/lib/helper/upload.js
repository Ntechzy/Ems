import cloudinary from "@/lib/cloudinary/cloudinary"; // Ensure this is your Cloudinary config

export const uploadToCloudinary = async (fileBuffer, folderPath) => {
    console.log("File being uploaded:", fileBuffer);

    try {
        // Get the size of the file buffer
        const totalSize = fileBuffer.length; // Assuming fileBuffer is a Buffer

        return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                {
                    folder: folderPath,
                    // resource_type: "auto", // Uncomment if needed
                },
                (error, result) => {
                    if (error) {
                        console.error("Upload error:", error);
                        return reject(error); // Reject promise if there is an error
                    }

                    // Log the result and resolve
                    console.log("Upload successful:", result);
                    resolve({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                }
            );

            // Track the amount of data uploaded
            let uploadedSize = 0;

            // Handle stream data event to track progress
            stream.on("data", (chunk) => {
                uploadedSize += chunk.length;
                const progress = Math.round((uploadedSize / totalSize) * 100);
                console.log(`Upload progress: ${progress}%`);
            });

            // Handle stream errors
            stream.on("error", (err) => {
                console.error("Stream error:", err); // Log stream errors
                reject(err);
            });

            // Send the buffer to Cloudinary
            stream.end(fileBuffer);
            console.log("Stream ended");
        });
    } catch (error) {
        console.error("Error uploading to Cloudinary", error);
        throw error; // Rethrow the error for further handling
    }
};
