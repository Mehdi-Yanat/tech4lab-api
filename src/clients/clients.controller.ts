import { Controller, Post, Body } from '@nestjs/common';
import { AddProductionSite } from 'src/auth/auth.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientsService) {}

  @Post('add/production-site')
  addProductionSite(@Body() addProductionSite: AddProductionSite) {
    return this.clientService.addProductionSite(addProductionSite);
  }
}
