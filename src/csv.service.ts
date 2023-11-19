// csv.service.ts

import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;
@Injectable()
export class CsvService {
  constructor(private readonly prisma: PrismaService) {}

  async processCsv(filePath: string, admin: any) {
    const results = [];

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Process the CSV data and create records in the database
        for (const row of results) {
          const columnKey = Object.keys(row)[0];
          const columnValue = row[columnKey];

          if (columnValue && admin.id) {
            const values = columnValue.split(';');

            const clientUsername = values[0];
            const productionSiteName = values[1];
            const machineName = values[2];
            const pieceName = values[3];

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
              create: { machineName, productionSiteId: productionSite.id },
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
              create: { pieceName, machineId: machine.id },
            });
          }
        }
      });

    return new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}
