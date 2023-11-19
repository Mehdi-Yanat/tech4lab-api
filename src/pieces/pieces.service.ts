import { Injectable } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PiecesService {
  constructor(private prisma: PrismaService) {}

  async getAllPieces(req: ExtendedRequest) {
    if (req.user.role === 'admin') {
      const pieces = await this.prisma.pieces.findMany({
        select: {
          id: true,
          pieceName: true,
          machine: {
            select: {
              machineName: true,
              productionSite: {
                select: {
                  placeName: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message: '',
        pieces,
      };
    } else {
      const pieces = await this.prisma.productionSite.findMany({
        where: {
          clientsId: req.user.id,
        },
        select: {
          machines: {
            select: {
              pieces: {
                select: {
                  pieceName: true,
                  machine: {
                    select: {
                      machineName: true,
                      productionSite: {
                        select: {
                          placeName: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      let piecesArray: any = pieces.map((el) => el.machines[0].pieces);
      piecesArray = piecesArray.flat(1);
      return {
        success: true,
        message: '',
        pieces: piecesArray,
      };
    }
  }
}
