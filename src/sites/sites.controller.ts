import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { SitesService } from './sites.service';
import ExtendedRequest from 'src/interface';
import { siteDataDto } from './sites.dto';

@Controller('production-sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('')
  getAllSites(@Req() req: ExtendedRequest) {
    return this.sitesService.getAllSites(req);
  }

  @Post('/add')
  addMachine(@Body() data: siteDataDto, @Req() req: ExtendedRequest) {
    return this.sitesService.addSites(data, req);
  }
}
