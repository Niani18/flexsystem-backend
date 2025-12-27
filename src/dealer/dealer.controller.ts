import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { DealerService } from "./dealer.service.js";
import { Dealer } from "./interface/dealer.entity.js";
import { DealerDTOUpdate } from "./dto/dealer-update.dto.js";
import { DealerPaginationDTO } from "./dto/dealer-pagination.dto.js";
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";
import { DealerCreateDTO } from "./dto/dealer.dto.js";

@Controller('dealer')
@Roles(Role.Admin)
export class DealerController {
  constructor(
    private readonly dealerService: DealerService
  ){}

  @Get("search")
  async search(@Query() query: DealerPaginationDTO) {
    return this.dealerService.search(query);
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number ): Promise<Dealer | null>{
    return this.dealerService.findOne(id)
  }

  @Get()
  async findAll(): Promise<Dealer[]>{
    return this.dealerService.findAll()
  }

  @Put(':id')
  async updatedealer(@Param('id', ParseIntPipe) id: number, @Body() updatedealerDto: DealerDTOUpdate): Promise<Dealer | null> {
    return this.dealerService.update(id, updatedealerDto);
  }

  @Delete(':id')
  async deletedealer(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.dealerService.delete(id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createDto: DealerCreateDTO) {
    return this.dealerService.create(createDto);
  }

}