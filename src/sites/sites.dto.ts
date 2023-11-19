import { IsString, MinLength } from 'class-validator';

export class siteDataDto {
  @IsString()
  @MinLength(3)
  placeName: string;
}
