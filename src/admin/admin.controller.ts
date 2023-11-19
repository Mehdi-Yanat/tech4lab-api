import {
  Controller,
  OnModuleInit,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddClientDto, CreateAdminDto } from './admin.dto';
import ExtendedRequest from 'src/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config';
import { ExcelService } from 'src/excel.service';
import { CsvService } from 'src/csv.service';

@Controller('admin')
export class AdminController implements OnModuleInit {
  constructor(
    private readonly adminService: AdminService,
    private readonly excelService: ExcelService,
    private readonly csvService: CsvService,
  ) {}

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
  addClient(@Body() addClient: AddClientDto, @Req() req: ExtendedRequest) {
    return this.adminService.addClient(addClient, req);
  }

  @Get('get/clients')
  getClients(@Req() req: ExtendedRequest) {
    return this.adminService.getAllClients(req);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadExcel(@UploadedFile() file: any, @Req() req: ExtendedRequest) {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    if (fileExtension === 'xlsx') {
      await this.excelService.processExcel(file.path, req.admin);
    } else if (fileExtension === 'csv') {
      await this.csvService.processCsv(file.path, req.admin);
    } else {
      // Handle unsupported file types
      throw new HttpException('Unsupported file type', HttpStatus.FORBIDDEN);
    }
    return {
      success: true,
      message: 'File uploaded and processed successfully.',
    };
  }
}
