
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        //cb=>callback it takes error and file path as parameter
        // Specify the directory for storing files -> here images is the folder where our image store
        cb(null,path.join(__dirname,'../../public/profile_images'))

    },
    filename: function(req,file,cb){
         // Use the original file name with a timestamp prefix to make it unique
        const timeStamp = Date.now();
        const fileName = `${timeStamp}_${file.originalname}`
        //this cb takes error and fileName
        cb(null,fileName);
    }
})

const upload = multer({storage})

// Export upload as a function
// here "image" is the input field name from which user uplaod image
export default () => upload.single('image');