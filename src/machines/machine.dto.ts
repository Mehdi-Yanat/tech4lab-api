import { IsInt, IsString, MinLength } from 'class-validator';

export class MachineDtoData {
  @IsString()
  @MinLength(3)
  machineName: string;

  @IsInt()
  productionSiteId: number;
}
