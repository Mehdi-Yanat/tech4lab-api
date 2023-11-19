import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PiecesService } from './pieces.service';
import { PiecesDtoData } from './pieces.dto';

@Controller('pieces')
export class PiecesController {
  constructor(private readonly piecesService: PiecesService) {}

  @Get('')
  getAllPieces(@Req() req: ExtendedRequest) {
    return this.piecesService.getAllPieces(req);
  }

  @Post('/add')
  addPieces(@Body() data: PiecesDtoData, @Req() req: ExtendedRequest) {
    return this.piecesService.addPieces(data, req);
  }
}
