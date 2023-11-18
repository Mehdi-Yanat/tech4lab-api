// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/clients/clients.dto';
import ExtendedRequest from 'src/interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.authService.generateToken(user);
    return {
      success: true,
      message: 'Login successfully!',
      access_token: token,
    };
  }

  @Get('profile')
  getDetails(@Req() req: ExtendedRequest) {
    return this.authService.getDetails(req);
  }
}
