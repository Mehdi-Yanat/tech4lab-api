import { IsString, MinLength } from 'class-validator';

export class AddProductionSite {
  @IsString()
  @MinLength(3)
  placeName: string;
}
