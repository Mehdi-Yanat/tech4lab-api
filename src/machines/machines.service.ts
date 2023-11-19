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
      const machines = await this.prisma.machine.findMany({
        where: {
          clientsId: req.user.id,
        },
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
        machines: machines,
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

    if (!dataMachine.productionSiteId) {
      throw new HttpException(
        'Please provide a production site identifier',
        HttpStatus.FORBIDDEN,
      );
    }

    if (user.role === 'admin' && !dataMachine.ClientId) {
      throw new HttpException(
        'Admin need to provide a client id',
        HttpStatus.FORBIDDEN,
      );
    }

    const machineExists = await this.prisma.machine.findFirst({
      where: {
        machineName: dataMachine.machineName,
      },
    });

    if (machineExists) {
      throw new HttpException('Machine already exists', HttpStatus.CONFLICT);
    }

    await this.prisma.machine.create({
      data: {
        machineName: dataMachine.machineName,
        clients: {
          connect: {
            id: user.role === 'admin' ? dataMachine.ClientId : user.id,
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
      message: 'Machine was added successfully!',
    };
  }
}
