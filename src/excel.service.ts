import { Injectable } from '@nestjs/common';
import * as exceljs from 'exceljs';
import { PrismaService } from './prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ExcelService {
  constructor(private readonly prisma: PrismaService) {}

  async processExcel(filePath: string, admin: any) {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);

    workbook.eachSheet(async (worksheet, sheetId) => {
      worksheet.eachRow(async (row, rowNumber) => {
        try {
          if (rowNumber === 1) {
            // Skip the first row (header)
            return;
          }

          const rowData = row.values;
          console.log(`Row ${rowNumber}: ${rowData} , ${sheetId}`);

          const rowDataArray = Array.isArray(rowData)
            ? rowData
            : Object.values(rowData as { [key: string]: any });

          console.log('rowDataArray:', rowDataArray);

          const [, clientUsername, productionSiteName, machineName, pieceName] =
            rowDataArray;

          const client = await this.prisma.clients.upsert({
            where: { username: clientUsername },
            update: {},
            create: {
              username: clientUsername,
              password: 'password',
              role: 'client',
              adminId: admin.id,
            },
          });

          const productionSite = await this.prisma.productionSite.upsert({
            where: { placeName: productionSiteName },
            update: {},
            create: { placeName: productionSiteName, clientsId: client.id },
          });

          const machine = await this.prisma.machine.upsert({
            where: { machineName },
            update: {},
            create: { machineName, productionSiteId: productionSite.id },
          });

          await this.prisma.pieces.upsert({
            where: { pieceName },
            update: {},
            create: { pieceName, machineId: machine.id },
          });
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError) {
            console.error('Prisma error:', error.message, error.code);
            // Handle specific Prisma error codes if needed
          } else {
            console.error('Error processing row:', error);
          }
        }
      });
    });
  }
}
