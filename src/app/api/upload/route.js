// import cloudinary from "@/lib/cloudinary/cloudinary";

// export const uploadToCloudinary = async (file, folderPath) => {
//   // Await the arrayBuffer promise
//   const buffer = await file.arrayBuffer();
//   const bytes = Buffer.from(buffer);

//   console.log("kehi");

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         { folder: folderPath, resource_type: "image" },
//         (error, result) => {
//           if (error) {
//             return reject(error);
//           } else {
//             resolve(result);
//           }
//         }
//       )
//       .end(bytes); // Sends the buffer to Cloudinary
//     console.log("ok in kehi ");
//   });
// };


// import cloudinary from "@/lib/cloudinary/cloudinary";

// export const uploadToCloudinary = async (file, folderPath) => {
//   console.log("File being uploaded:", file);

//   try {
//     // Convert the file to an ArrayBuffer
//     const buffer = await file.arrayBuffer();
//     const bytes = Buffer.from(buffer); // Convert ArrayBuffer to Buffer (Node.js)

//     // Return a promise for the upload process
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: folderPath, resource_type: "image" },
//         (error, result) => {
//           if (error) {
//             console.error("Upload error:", error);
//             return reject(error); // Reject promise if there is an error
//           }
          
//           // Log the result and resolve
//           console.log("Upload successful:", result);
//           resolve(result); // Resolve with the result from Cloudinary
//         }
//       );

//       // Handle the end of the stream
//       stream.on('finish', () => {
//         console.log("Stream finished"); // Log when stream finishes
//       });

//       // Handle stream errors
//       stream.on('error', (err) => {
//         console.error("Stream error:", err); // Log stream errors
//         reject(err);
//       });

//       // Send the buffer to Cloudinary
//       stream.end("bytrasfdjh",bytes); // Ensure to end the stream after writing data
//       console.log("Stream ended"); // Add logging to confirm stream is ending
//     });
//   } catch (error) {
//     console.error("Error uploading to Cloudinary", error);
//     throw error;
//   }
// };


// import cloudinary from "@/lib/cloudinary/cloudinary"; // Ensure this is your Cloudinary config
// import { getDataUri} from "@/lib/helper/dataUri";
// // import { getDataUri } from "@/lib/utils"; // Assuming you have a utility function to get data URI

// export const uploadToCloudinary = async (file, folderPath) => {
//   console.log("File being uploaded:", file);

//   try {
//     // Convert the file to a Data URI
//     const fileUri = getDataUri(file);
    
//     // Upload to Cloudinary
//     const cloud = await cloudinary.v2.uploader.upload(fileUri.content, {
//       folder: folderPath,
//       resource_type: "image",
//     });

//     console.log("Upload successful:", cloud);

//     // Return the result
//     return {
//       public_id: cloud.public_id,
//       url: cloud.secure_url,
//     };
    
//   } catch (error) {
//     console.error("Error uploading to Cloudinary", error);
//     throw error; // Rethrow the error for further handling
//   }
// };

import cloudinary from "@/lib/cloudinary/cloudinary"; // Ensure this is your Cloudinary config

export const uploadToCloudinary = async (fileBuffer, folderPath) => {
  console.log("File being uploaded:", fileBuffer);

  try {
    // Return a promise for the upload process
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: folderPath,
          resource_type: "image",
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
