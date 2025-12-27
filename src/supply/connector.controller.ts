import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { ConnectorService } from "./connector.service.js";
import { Connector } from "./interface/connector.entity.js";
import { ConnectorDTO } from "./dto/connector.dto.js";
import { ConnectorUpdateDTO } from "./dto/connector-update.dto.js"
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";

@Roles(Role.Admin)
@Controller("supplies/connector")
export class ConnectorController {

    constructor(
        private readonly connectorService : ConnectorService
    ){}

    @Get()
    async findAll() : Promise<Connector[]> {
        return this.connectorService.findAll()
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id : number) : Promise<Connector | null> {
        return this.connectorService.findById(id);
    }
    
    @Post()
    async create(@Body() dto : ConnectorDTO) : Promise<Connector> {
        return this.connectorService.create(dto);
    }

    @Put(":id")
    async update(@Param("id", ParseIntPipe) id : number, @Body() dto : ConnectorUpdateDTO) : Promise<Connector | null> {
        return this.connectorService.update(id, dto);
    }
    
    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id : number) : Promise<string> {
        return this.connectorService.delete(id);
    }
}