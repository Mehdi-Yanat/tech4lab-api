import { Injectable } from '@nestjs/common';
import * as exceljs from 'exceljs';
import { PrismaService } from './prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

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

          const hash = await bcrypt.hash(clientUsername, saltOrRounds);

          const client = await this.prisma.clients.upsert({
            where: { username: clientUsername },
            update: {},
            create: {
              username: clientUsername,
              password: hash,
              role: 'client',
              adminId: admin.id,
            },
          });

          const productionSite = await this.prisma.productionSite.upsert({
            where: { placeName: productionSiteName },
            update: {
              clients: {
                connect: {
                  id: client.id,
                },
              },
            },
            create: { placeName: productionSiteName, clientsId: client.id },
          });

          const machine = await this.prisma.machine.upsert({
            where: { machineName },
            update: {
              clients: {
                connect: {
                  id: client.id,
                },
              },
              productionSite: {
                connect: {
                  id: productionSite.id,
                },
              },
            },
            create: {
              machineName,
              productionSiteId: productionSite.id,
              clientsId: client.id,
            },
          });

          await this.prisma.pieces.upsert({
            where: { pieceName },
            update: {
              clients: {
                connect: {
                  id: client.id,
                },
              },
              productionSite: {
                connect: {
                  id: productionSite.id,
                },
              },
              machine: {
                connect: {
                  id: machine.id,
                },
              },
            },
            create: {
              pieceName,
              machineId: machine.id,
              clientsId: client.id,
              productionSiteId: productionSite.id,
            },
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
