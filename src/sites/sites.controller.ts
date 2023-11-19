import { Controller, Get, Req } from '@nestjs/common';
import { SitesService } from './sites.service';
import ExtendedRequest from 'src/interface';

@Controller('production-sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('')
  getAllSites(@Req() req: ExtendedRequest) {
    return this.sitesService.getAllSites(req);
  }
}
