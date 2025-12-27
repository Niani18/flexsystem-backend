import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { Elbow } from "./interface/elbow.entity.js";
import { ElbowDTO } from "./dto/elbow.dto.js";
import { ElbowService } from "./elbow.service.js";
import { ElbowUpdateDTO } from "./dto/elbow-update.dto.js"
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";

@Roles(Role.Admin)
@Controller('supplies/elbow')
export class ElbowController {

  constructor(
    private readonly elbowService: ElbowService
  ){}

  @Get()
  async findAll(): Promise<Elbow[] | null>{
    return this.elbowService.findAll()
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number ): Promise<Elbow | null>{
    return this.elbowService.findOne(id)
  } 

  @Post()
  async create(@Body() elbow: ElbowDTO ): Promise<Elbow>{
    return await this.elbowService.create(elbow);
  }

  @Put(':id')
  async updateelbow(@Param('id', ParseIntPipe) id: number, @Body() updateelbowDto: ElbowUpdateDTO): Promise<Elbow | null> {
    return this.elbowService.update(id, updateelbowDto);
  }

  @Delete(':id')
  async deleteelbow(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.elbowService.delete(id);
  }

}