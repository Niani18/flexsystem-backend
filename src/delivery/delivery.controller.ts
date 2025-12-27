import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { DeliveryService } from "./delivery.service.js";
import { Delivery } from "./interface/delivery.entity.js";
import { DeliveryDTO } from "./dto/delivery.dto.js";
import { DeliveryUpdateDTO } from "./dto/delivery-update.dto.js";
import { DeliveryPaginationDTO } from "./dto/delivery-pagination.dto.js";
import { Roles, User } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";


@Controller("deliveries")
export class DeliveryController {

    constructor(
        private readonly deliveryService : DeliveryService
    ) {}

    @Roles(Role.Dealer)
    @Get("search-dealer")
    async getForDealer (@User() user:any) {
        return this.deliveryService.getForDealer(user)
    }

    @Roles(Role.Admin)
    @Get()
    async findAll() : Promise<Delivery[]> {
        return this.deliveryService.findAll();
    }

    @Roles(Role.Admin)
    @Get('search-admin')
    async search(@Query() query: DeliveryPaginationDTO) {
        return this.deliveryService.search(query);
    }
    
    @Roles(Role.Admin)
    @Get(":id")
    async findOne(@Param("id", ParseIntPipe) id: number) : Promise<Delivery | null> {
        return this.deliveryService.findById(id);
    }

    @Roles(Role.Admin)
    @Post()
    async create(@Body() dto: DeliveryDTO) : Promise<Delivery> {
        return this.deliveryService.create(dto);
    }

    @Roles(Role.Admin, Role.Dealer)
    @Patch('finish/:id')
    async delivered (@Param("id", ParseIntPipe) id: number, @User() user: any) {
        return this.deliveryService.delivered(id, user)
    }

    @Roles(Role.Admin)
    @Patch(":id")
    async update(@Param("id", ParseIntPipe) id: number, @Body() dto: DeliveryUpdateDTO) : Promise<Delivery | null> {
        return this.deliveryService.update(id, dto);
    }

    @Roles(Role.Admin)
    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) : Promise<string> {
        return this.deliveryService.delete(id);
    }


}