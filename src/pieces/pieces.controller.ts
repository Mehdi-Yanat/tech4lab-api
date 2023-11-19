import { Controller, Get, Req } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { PiecesService } from './pieces.service';

@Controller('pieces')
export class PiecesController {
  constructor(private readonly piecesService: PiecesService) {}

  @Get('')
  getAllPieces(@Req() req: ExtendedRequest) {
    return this.piecesService.getAllPieces(req);
  }
}
