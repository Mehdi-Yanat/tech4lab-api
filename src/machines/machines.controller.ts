import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import ExtendedRequest from 'src/interface';
import { MachinesService } from './machines.service';
import { MachineDtoData } from './machine.dto';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Get('')
  getAllMachines(@Req() req: ExtendedRequest) {
    return this.machinesService.getAllMachines(req);
  }

  @Post('/add')
  addMachine(@Body() data: MachineDtoData, @Req() req: ExtendedRequest) {
    return this.machinesService.addMachines(data, req);
  }
}
