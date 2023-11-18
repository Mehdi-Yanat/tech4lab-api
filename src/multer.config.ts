import { diskStorage } from 'multer';

export const multerConfig = {
  dest: './uploads', // Specify your upload directory
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Specify your upload directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      // Use the original file extension for the uploaded file
      const fileExtension = file.originalname.split('.').pop();
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    },
  }),
};
