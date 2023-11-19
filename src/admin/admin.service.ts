import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AddClientDto, CreateAdminDto } from './admin.dto';
import ExtendedRequest from 'src/interface';

const saltOrRounds = 10;

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async initAdmin(): Promise<string> {
    // Check if admin already exists
    const existingAdmin = await this.prisma.admin.findFirst({
      where: {
        username: 'admin tf4',
      },
    });

    if (existingAdmin) {
      return 'Admin already initialized.';
    }

    const password = process.env.ADMIN_PASSWORD;
    const hash = await bcrypt.hash(password, saltOrRounds);

    // If admin does not exist, create a new admin
    await this.prisma.admin.create({
      data: {
        username: 'admin tf4',
        password: hash, // You should hash and salt the password in a real application
      },
    });

    return 'Admin initialized successfully.';
  }

  async createAdmin(createAdmin: CreateAdminDto): Promise<any> {
    // Check if admin already exists
    const existingAdmin = await this.prisma.admin.findFirst({
      where: {
        username: createAdmin.username,
      },
    });

    if (existingAdmin) {
      throw new HttpException('Admin already exists', HttpStatus.FORBIDDEN);
    }

    await this.prisma.admin.create({
      data: createAdmin,
    });

    return {
      message: 'Admin account created',
    };
  }

  async addClient(addClient: AddClientDto, req: ExtendedRequest): Promise<any> {
    if (!req.admin) {
      throw new UnauthorizedException();
    }

    const hash = await bcrypt.hash(addClient.password, saltOrRounds);

    const isClientExists = await this.prisma.clients.findFirst({
      where: {
        username: addClient.username,
      },
    });

    if (isClientExists) {
      throw new HttpException('Client already exists', HttpStatus.FORBIDDEN);
    } else {
      await this.prisma.clients.create({
        data: {
          username: addClient.username,
          password: hash,
          admin: {
            connect: {
              id: req.admin.id,
            },
          },
          productionSite: {
            connect: {
              id: addClient.productionSiteId,
            },
          },
        },
      });

      return {
        message: 'Client was added successfully!',
      };
    }
  }

  async getAllClients({ admin }: ExtendedRequest): Promise<any> {
    if (!admin) {
      throw new UnauthorizedException();
    }

    const clients = await this.prisma.clients.findMany({
      select: {
        id: true,
        username: true,
        productionSite: {
          select: {
            placeName: true,
          },
        },
      },
    });

    return {
      success: true,
      message: '',
      clients,
    };
  }
}
