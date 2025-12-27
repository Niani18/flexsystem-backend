import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { ClientService } from "./client.service.js";
import { Client } from "./interface/client.entity.js";
import { ClientCreateDTO } from "./dto/client.dto.js";
import { ClientDtoUpdate } from "./dto/clientupdate.dto.js";
import { ClientPaginationDTO } from "./dto/client-pagination.dto.js";
import { Role } from "../auth/role.enum.js";
import { Public, Roles } from "../shared/decorators.js";

@Controller('client')
@Roles(Role.Admin)
export class ClientController {
  constructor(
    private readonly clientService: ClientService
  ){}

  @Get("search")
  async search(@Query() query: ClientPaginationDTO) {
    return this.clientService.search(query);
  }

  @Get(':email')
  async findById(@Param('email') email: string ): Promise<Client | null>{
    return this.clientService.findOne(email)
  }

  @Get()
  async findAll(): Promise<Client[] | null>{
    return this.clientService.findAll()
  }


  @Patch(':id')
  async updateClient(@Param('id', ParseIntPipe) id: number, @Body() updateClientDto: ClientDtoUpdate): Promise<Client | null> {
    return this.clientService.update(id, updateClientDto);
  }

  @Delete(':id')
  async deleteClient(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.clientService.delete(id);
  }

}