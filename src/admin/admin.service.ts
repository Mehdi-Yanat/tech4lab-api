import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { AddClientDto, CreateAdminDto } from './admin.dto';

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

    const saltOrRounds = 10;
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

  async addClient(addClient: AddClientDto): Promise<any> {
    console.log('====================================');
    console.log(addClient);
    console.log('====================================');
  }
}
