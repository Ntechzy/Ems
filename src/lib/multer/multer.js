// lib/multer.js
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

 const uploadHandler = upload.single('profile_photo'); 
 export default uploadHandler;
