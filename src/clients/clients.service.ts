import { Injectable } from '@nestjs/common';
import { AddProductionSite } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async addProductionSite(
    addProductionSite: AddProductionSite,
  ): Promise<string> {
    // Check if admin already exists
    console.log('====================================');
    console.log(addProductionSite);
    console.log('====================================');
    return 'Admin initialized successfully.';
  }
}
