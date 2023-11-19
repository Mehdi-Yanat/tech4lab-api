import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class PiecesDtoData {
  @IsString()
  @MinLength(3)
  pieceName: string;

  @IsInt()
  @Min(1, { message: 'please check your production site id' })
  productionSiteId: number;

  @IsInt()
  @Min(1, { message: 'please check your machine id' })
  machineId: number;

  @IsInt()
  ClientId?: number;
}
