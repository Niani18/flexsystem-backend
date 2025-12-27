import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { Order } from "./interface/order.entity";
import { OrderCreateDTO } from "./dto/order.dto";
import { OrderService } from "./order.service";
import { Supply, SupplyType } from "../supply/interface/supply.entity.js";
import { SupplyService } from "../supply/supply.service.js";
import { OrderPaginationDTO } from "./dto/order-pagination.dto.js";
import { Roles, User } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";
import { PaymentDTO } from "./dto/payment.dto.js";
import { HoseDTO } from "./dto/hose.dto.js";
import { OrderClientQueryDTO } from "./dto/order-client-query.dto.js";


@Controller("orders")
@Roles(Role.Admin)
export class OrderController {
    
    constructor(
        private readonly orderService: OrderService,
        private readonly supplyService: SupplyService
    ) {}


    @Get('search-admin')
    async search(@Query() query: OrderPaginationDTO) {
        return this.orderService.search(query);
    }

    @Get('search-client')
    @Roles(Role.Client)
    async getUserOrders(@Query() query: OrderClientQueryDTO, @User() user: any) {
        return this.orderService.clientSearch(query, user.clientId);
    }

    @Get(":id")
    @Roles(Role.Admin, Role.Client)
    async findOne(@Param("id", ParseIntPipe) id: number, @User() user: any) : Promise<Order | null> {
        const order = await this.orderService.findById(id);
        if(user.clientId && (order?.client?.id != user.clientId && order?.client != user.clientId))
            throw new NotFoundException("Order not found for client");
        return order;
    }

    @Get()
    async findAll(): Promise<Order[] | null> {
        return this.orderService.findAll();
    }


    @Post()
    @Roles(Role.Client)
    async create(@Body() dto: OrderCreateDTO,  @User() user: any) : Promise<Order> {
        const clientId = user.clientId;
        //-------------------------------------
        //---- Validate minimum requirements:
        //-------- Get supply type
        //-------- Count it
        //-------- Check minimums
        //-------------------------------------

        type TypeRecord = {
            screw: number,
            casing: number,
            tube: number
        };

        for (const hose of dto.hose) { // Por cada manguera

            let supplyTypeCount : TypeRecord = { // Permite la cuenta de suministros por tipo (no todos).
                screw: 0,
                casing: 0,
                tube: 0
            };

            for (const item of hose.supplyHose) {
                // Extrae el tipo
                const supplyEntity = await this.supplyService.findById(item.supply);
                if (!supplyEntity) throw new NotFoundException("Couldn't find a supply with id " + item.supply);
                const supplyType: SupplyType = supplyEntity?.type ?? SupplyType.casing; // De todos modos no va a pasar...
                
                if (!(supplyType in supplyTypeCount)) continue; // Salta validaciones no necesarias.
                
                // Cuenta suministros
                supplyTypeCount[supplyType as keyof TypeRecord] += item.amount;
            }

            if (
                supplyTypeCount.screw < 2 ||
                supplyTypeCount.tube < 1 ||
                supplyTypeCount.casing < 1
            ) throw new BadRequestException("Minimum requirements not met");

            // TODO: Controlar que desde el front no se pueda pasar varias veces el mismo supply (que cada item sea de un supply distinto). Agrupar en ese caso.
        }

        return this.orderService.create(dto, clientId);
    }

    @Patch(":id")
    async updateOrder(@Param("id", ParseIntPipe) id: number) : Promise<Order | null> {
        return this.orderService.updateOrder(id);
    }

    @Patch(":id/payment")
    async pay(@Param("id", ParseIntPipe) id: number, @Body() dto: PaymentDTO) : Promise<Order | null> {
        return this.orderService.payment(id, dto);
    }

    @Patch("/:orderId/hose/:hoseId")
    async updateHoseInOrder(@Param("orderId", ParseIntPipe) orderId: number, @Param("hoseId", ParseIntPipe) hoseId: number, @Body() dto: HoseDTO) {
        
        type TypeRecord = {
            screw: number,
            casing: number,
            tube: number
        };

        let supplyTypeCount : TypeRecord = { 
            screw: 0,
            casing: 0,
            tube: 0
        };

        for (const item of dto.supplyHose) {
            // Extrae el tipo
            const supplyEntity = await this.supplyService.findById(item.supply);
            if (!supplyEntity) throw new NotFoundException("Couldn't find a supply with id " + item.supply);
            const supplyType: SupplyType = supplyEntity?.type ?? SupplyType.casing;
                
            if (!(supplyType in supplyTypeCount)) continue; 
                
            supplyTypeCount[supplyType as keyof TypeRecord] += item.amount;
        }

        if (
            supplyTypeCount.screw < 2 ||
            supplyTypeCount.tube < 1 ||
            supplyTypeCount.casing < 1
        ) throw new BadRequestException("Minimum requirements not met");   
        
        return this.orderService.replaceHoseInOrder(orderId, hoseId, dto);
    }

    @Delete(":id")
    async delete(@Param("id", ParseIntPipe) id: number) : Promise<string> {
        return this.orderService.delete(id);
    }
}