import { Injectable } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MachinesService {
  constructor(private prisma: PrismaService) {}

  async getAllMachines(req: ExtendedRequest) {
    if (req.user.role === 'admin') {
      const machines = await this.prisma.machine.findMany({
        select: {
          id: true,
          machineName: true,
          productionSite: {
            select: {
              placeName: true,
            },
          },
          pieces: {
            select: {
              pieceName: true,
            },
          },
        },
      });

      return {
        success: true,
        message: '',
        machines,
      };
    } else {
      const machines = await this.prisma.productionSite.findMany({
        where: {
          clientsId: req.user.id,
        },
        select: {
          machines: {
            select: {
              id: true,
              machineName: true,
              pieces: true,
              productionSite: {
                select: {
                  placeName: true,
                },
              },
            },
          },
        },
      });

      let machinesArray: any = machines.map((el) => el.machines);
      machinesArray = machinesArray.flat(1);
      return {
        success: true,
        message: '',
        machines: machinesArray,
      };
    }
  }
}
