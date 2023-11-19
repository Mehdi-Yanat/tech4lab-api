import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';

const allowedFileTypes = ['xlsx', 'xls', 'csv'];

const fileFilter = (req, file, cb) => {
  const fileExtension = file.originalname.split('.').pop().toLowerCase();

  if (allowedFileTypes.includes(fileExtension)) {
    // Allow the file
    cb(null, true);
  } else {
    // Reject the file with an error message
    cb(
      new HttpException(
        'Only Excel (xlsx, xls) and CSV files are allowed',
        HttpStatus.FORBIDDEN,
      ),
    );
  }
};

export const multerConfig = {
  dest: './upload', // Specify your upload directory
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './upload'); // Specify your upload directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExtension = file.originalname.split('.').pop();
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + fileExtension);
    },
  }),
  fileFilter: fileFilter, // Add the custom file filter
};
