import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { PrismaService } from './prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY, // Replace with your actual secret key
    }),
  ],
  controllers: [AppController, AdminController, AuthController],
  providers: [
    AppService,
    AdminService,
    PrismaService,
    AuthService,
    JwtStrategy,
  ],
  exports: [JwtStrategy],
})
export class AppModule {}
