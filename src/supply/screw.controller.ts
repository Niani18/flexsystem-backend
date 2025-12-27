import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Screw } from "./interface/screw.entity.js";
import { ScrewDTO } from "./dto/screw.dto.js";
import { ScrewService } from "./screw.service.js";
import { ScrewUpdateDTO } from "./dto/screw-update.dto.js";
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";

@Roles(Role.Admin)
@Controller('supplies/screw')
export class ScrewController {

  constructor(
    private readonly screwService: ScrewService
  ){}

  @Get()
  async findAll(): Promise<Screw[] | null>{
    return this.screwService.findAll()
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number ): Promise<Screw | null>{
    return this.screwService.findOne(id)
  }

  @Post()
  async create(@Body() screw: ScrewDTO ): Promise<Screw>{
    return await this.screwService.create(screw);
  }

  @Put(':id')
  async updatescrew(@Param('id', ParseIntPipe) id: number, @Body() updatescrewDto: ScrewUpdateDTO): Promise<Screw | null> {
    return this.screwService.update(id, updatescrewDto);
  }

  @Delete(':id')
  async deletescrew(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.screwService.delete(id);
  }

}