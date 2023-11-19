import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class AddClientDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsInt()
  @Min(1, { message: 'please check your production site id' })
  productionSiteId: number;
}
