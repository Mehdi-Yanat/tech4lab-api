// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import ExtendedRequest from 'src/interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const isAdmin = await this.prisma.admin.findFirst({
      where: {
        username,
      },
    });

    if (isAdmin) {
      const isMatch = await bcrypt.compare(password, isAdmin.password);

      if (!isMatch) {
        return null;
      } else {
        return isAdmin;
      }
    }

    const isClient = await this.prisma.clients.findFirst({
      where: {
        username,
      },
    });

    if (isClient) {
      const isMatch = await bcrypt.compare(password, isClient.password);

      if (!isMatch) {
        return null;
      } else {
        return isClient;
      }
    }
  }

  async generateToken(user: any): Promise<string> {
    const payload = { username: user.username, sub: user.id, roles: user.role };
    const token = this.jwtService.sign(payload);

    const isAdmin = await this.prisma.admin.findFirst({
      where: {
        username: user.username,
      },
    });

    if (isAdmin) {
      await this.prisma.admin.update({
        where: {
          username: user.username,
        },
        data: {
          tokens: [token],
        },
      });
    }

    const isClient = await this.prisma.clients.findFirst({
      where: {
        username: user.username,
      },
    });

    if (isClient) {
      await this.prisma.clients.update({
        where: {
          username: user.username,
        },
        data: {
          tokens: [token],
        },
      });
    }

    return token;
  }

  async getDetails({ user }: ExtendedRequest): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      success: true,
      message: '',
      user: user,
    };
  }
  async changePassword(password, { user }: ExtendedRequest): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    const hash = await bcrypt.hash(password, 10);

    if (user.role === 'admin') {
      await this.prisma.admin.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
        },
      });
    } else {
      await this.prisma.clients.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
        },
      });
    }

    return {
      success: true,
      message: 'Password updated successfully!',
    };
  }
}
