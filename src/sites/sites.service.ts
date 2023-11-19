import { Injectable } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';

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
}
