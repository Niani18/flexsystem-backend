import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Patch } from "@nestjs/common";
import { Casing } from "./interface/casing.entity.js";
import { CasingDTO } from "./dto/casing.dto.js";
import { CasingService } from "./casing.service.js";
import { CasingUpdateDTO } from "./dto/casing-update.dto.js"
import { Public, Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";


@Roles(Role.Admin)
@Controller("supplies/casing")
export class CasingController
{
    constructor(
        private readonly casingService : CasingService
    ) {}

    @Get()
    async findAll() : Promise<Casing[]> {
        return this.casingService.findAll();
    }

    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id : number) : Promise<Casing | null> {
        return this.casingService.findById(id);
    }

    @Post()
    async create(@Body() dto : CasingDTO) : Promise<Casing | null> {
        return this.casingService.create(dto);
    }

    @Patch(":id")
    async update(@Param("id", ParseIntPipe) id : number, @Body() dto : CasingUpdateDTO) : Promise<Casing | null> {
         return this.casingService.update(id, dto);
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id : number) : Promise<string> {
        return this.casingService.delete(id);
    }
}