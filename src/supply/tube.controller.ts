import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TubeService } from "./tube.service.js";
import { Tube } from "./interface/tube.entity.js";
import { TubeDTO } from "./dto/tube.dto.js";
import { TubeUpdateDTO } from "./dto/tube-update.dto.js";
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";

@Roles(Role.Admin)
@Controller('supplies/tube')
export class TubeController {

  constructor(
    private readonly tubeService: TubeService
  ){}

  @Get()
  async findAll(): Promise<Tube[] | null>{
    return this.tubeService.findAll()
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number ): Promise<Tube | null>{
    return this.tubeService.findOne(id)
  }

  @Post()
  async create(@Body() tube: TubeDTO ): Promise<Tube>{
    return await this.tubeService.create(tube);
  }

  @Put(':id')
  async updatetube(@Param('id', ParseIntPipe) id: number, @Body() updatetubeDto: TubeUpdateDTO): Promise<Tube | null> {
    return this.tubeService.update(id, updatetubeDto);
  }

  @Delete(':id')
  async deletetube(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.tubeService.delete(id);
  }

}