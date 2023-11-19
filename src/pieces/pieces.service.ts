import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PrismaService } from 'src/prisma.service';
import { PiecesDtoData } from './pieces.dto';

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
      const pieces = await this.prisma.pieces.findMany({
        where: {
          clientsId: req.user.id,
        },
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
        pieces: pieces,
      };
    }
  }

  async addPieces(
    dataPieces: PiecesDtoData,
    { user }: ExtendedRequest,
  ): Promise<any> {
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPieceExist = await this.prisma.pieces.findFirst({
      where: {
        pieceName: dataPieces.pieceName,
      },
    });

    if (isPieceExist) {
      throw new HttpException('Pieces already exists', HttpStatus.CONFLICT);
    }

    if (user.role === 'admin' && !dataPieces.ClientId) {
      throw new HttpException(
        'Admin need to provide a client id',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.pieces.create({
      data: {
        pieceName: dataPieces.pieceName,
        clients: {
          connect: {
            id: user.role === 'admin' ? dataPieces.ClientId : user.id,
          },
        },
        machine: {
          connect: {
            id: dataPieces.machineId,
          },
        },
        productionSite: {
          connect: {
            id: dataPieces.productionSiteId,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Pieces was added successfully!',
    };
  }
}
