import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { MachineDtoData } from './machine.dto';

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
              id: true,
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
                  id: true,
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

  async addMachines(
    dataMachine: MachineDtoData,
    { user }: ExtendedRequest,
  ): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    if (dataMachine.productionSiteId === 0) {
      throw new HttpException(
        'Please provide a production site identifier',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.machine.create({
      data: {
        machineName: dataMachine.machineName,
        clients: {
          connect: {
            id: user.id,
          },
        },
        productionSite: {
          connect: {
            id: dataMachine.productionSiteId,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Production Site added successfully!',
    };
  }
}
