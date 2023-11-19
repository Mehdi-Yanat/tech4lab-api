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
import { SitesController } from './sites/sites.controller';
import { SitesService } from './sites/sites.service';
import { MachinesController } from './machines/machines.controller';
import { MachinesService } from './machines/machines.service';
import { PiecesService } from './pieces/pieces.service';
import { PiecesController } from './pieces/pieces.controller';
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
  controllers: [
    AppController,
    AdminController,
    AuthController,
    SitesController,
    MachinesController,
    PiecesController,
  ],
  providers: [
    AppService,
    AdminService,
    PrismaService,
    AuthService,
    JwtStrategy,
    ExcelService,
    CsvService,
    SitesService,
    MachinesService,
    PiecesService,
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
      {
        path: 'admin/get/clients',
        method: RequestMethod.GET,
      },
    );
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'auth/profile',
        method: RequestMethod.GET,
      },
      {
        path: 'auth/change',
        method: RequestMethod.POST,
      },
      {
        path: 'production-sites',
        method: RequestMethod.GET,
      },
      {
        path: 'production-sites/add',
        method: RequestMethod.POST,
      },
      {
        path: 'machines',
        method: RequestMethod.GET,
      },
      {
        path: 'machines/add',
        method: RequestMethod.POST,
      },
      {
        path: 'pieces',
        method: RequestMethod.GET,
      },
      {
        path: 'pieces/add',
        method: RequestMethod.POST,
      },
    );
  }
}
