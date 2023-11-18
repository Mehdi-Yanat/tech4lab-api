import { Request } from 'express';

interface ExtendedRequest extends Request {
  admin?: any; // Adjust the type of admin property as needed
  user?: any;
  headers: {
    authorization: string;
  };
}

export default ExtendedRequest;
