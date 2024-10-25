// import DataUriParser from 'datauri/parser.js';
// import { extname } from 'path';

// export function getdataUri(file) {
//     const parser = new DataUriParser();
//     const extName = extname(file.originalname).toString()
//     return parser.format(extName, file.buffer); 
// } 


export const getDataUri = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        // Resolve the Data URI when reading is complete
        resolve({
          content: reader.result,
        });
      };
  
      reader.onerror = () => {
        // Reject the promise if there is an error
        reject(new Error("Failed to convert file to Data URI"));
      };
  
      // Read the file as a Data URL
      reader.readAsDataURL(file);
    });
  };
  