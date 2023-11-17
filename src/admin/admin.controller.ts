import { Controller, OnModuleInit, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddClientDto, CreateAdminDto } from './admin.dto';

@Controller('admin')
export class AdminController implements OnModuleInit {
  constructor(private readonly adminService: AdminService) {}

  onModuleInit() {
    this.initAdminInternally();
  }

  private async initAdminInternally(): Promise<string> {
    const result = await this.adminService.initAdmin();
    console.log(result); // You can log the result or handle it as needed
    return result;
  }

  @Post('create')
  createAdmin(@Body() createAdmin: CreateAdminDto) {
    return this.adminService.createAdmin(createAdmin);
  }

  @Post('add/clients')
  addClient(@Body() addClient: AddClientDto) {
    return this.adminService.addClient(addClient);
  }
}
