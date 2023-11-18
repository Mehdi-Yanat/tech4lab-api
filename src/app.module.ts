import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
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
import { SuperAdminMiddleware } from './middlewares/admin-auth.middlewares';
import { ExcelService } from './excel.service';
import { CsvService } from './csv.service';
import { AuthMiddleware } from './middlewares/auth.middlewares';
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
    ExcelService,
    CsvService,
  ],
  exports: [JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SuperAdminMiddleware).forRoutes(
      {
        path: 'admin/add/clients',
        method: RequestMethod.POST,
      },
      {
        path: 'admin/upload',
        method: RequestMethod.POST,
      },
    );
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'auth/profile',
      method: RequestMethod.GET,
    });
  }
}
