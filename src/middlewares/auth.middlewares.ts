// auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
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
        throw new Error('Non Autorisé !');
      }

      const token = authorization.split('Bearer ')[1];

      const verifiedToken: any = jwt.verify(token, 'your-secret-key'); // Replace with your secret key

      const user = await this.prisma.clients.findUnique({
        where: { id: verifiedToken.userId },
      });

      if (!user || !user.tokens.includes(token)) {
        throw new Error('Non Autorisé !');
      }

      delete user.password;
      delete user.tokens;

      req.user = user;

      next();
    } catch (error) {
      console.log(error.message);
      return res.json({
        success: false,
        message: 'Non Autorisé !',
      });
    }
  }
}
