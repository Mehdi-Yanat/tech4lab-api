import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class MachineDtoData {
  @IsString()
  @MinLength(3)
  machineName: string;

  @IsInt()
  @Min(1, { message: 'please check your production site id' })
  productionSiteId: number;

  @IsInt()
  ClientId?: number;
}
