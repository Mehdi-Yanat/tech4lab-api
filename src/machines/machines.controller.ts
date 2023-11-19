import { Controller, Get, Req } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { MachinesService } from './machines.service';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get('')
  getAllMachines(@Req() req: ExtendedRequest) {
    return this.machinesService.getAllMachines(req);
  }
}
