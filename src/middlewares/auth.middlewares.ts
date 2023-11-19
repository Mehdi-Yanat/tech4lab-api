// auth.middleware.ts

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const authorization = req.header('authorization');

      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedException();
      }

      const token = authorization.split('Bearer ')[1];

      const verifiedToken: any = jwt.verify(token, process.env.SECRET_KEY); // Replace with your secret key

      if (verifiedToken.roles == 'admin') {
        const admin = await this.prisma.admin.findUnique({
          where: { id: verifiedToken.sub },
        });
        delete admin.tokens;

        req.user = admin;
      } else {
        const user = await this.prisma.clients.findUnique({
          where: { id: verifiedToken.sub },
        });

        if (user) {
          delete user.tokens;

          req.user = user;
        }
      }

      next();
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Not allowed!',
      });
    }
  }
}
