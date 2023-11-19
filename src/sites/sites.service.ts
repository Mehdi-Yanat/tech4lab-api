import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { siteDataDto } from './sites.dto';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async getAllSites(req: ExtendedRequest) {
    if (req.user.role === 'admin') {
      const sites = await this.prisma.productionSite.findMany({
        select: {
          id: true,
          placeName: true,
          machines: {
            select: {
              pieces: true,
            },
          },
        },
      });

      return {
        success: true,
        message: '',
        productionSites: sites,
      };
    } else {
      const sites = await this.prisma.productionSite.findMany({
        where: {
          clientsId: req.user.id,
        },
        select: {
          id: true,
          placeName: true,
          machines: {
            select: {
              pieces: true,
            },
          },
        },
      });

      return {
        success: true,
        message: '',
        productionSites: sites,
      };
    }
  }

  async addSites(
    dataSite: siteDataDto,
    { user }: ExtendedRequest,
  ): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    const isSiteExist = await this.prisma.productionSite.findFirst({
      where: {
        placeName: dataSite.placeName,
      },
    });

    if (isSiteExist) {
      throw new HttpException('Site already exists', HttpStatus.CONFLICT);
    }

    if (user.role === 'admin' && !dataSite.ClientId) {
      throw new HttpException(
        'Admin need to provide a client id',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.productionSite.create({
      data: {
        placeName: dataSite.placeName,
        clients: {
          connect: {
            id: user.role === 'admin' ? dataSite.ClientId : user.id,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Production Site was added successfully!',
    };
  }
}
