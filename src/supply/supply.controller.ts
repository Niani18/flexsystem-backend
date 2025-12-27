import { Controller, Get, Query } from "@nestjs/common";
import { SupplyPaginationDTO } from "./dto/supply-pagination.dto.js";
import { SupplyService } from "./supply.service.js";
import { Roles } from "../shared/decorators.js";
import { Role } from "../auth/role.enum.js";



@Controller("supplies")
export class SupplyController {

    constructor(
        private readonly supplyService: SupplyService
    ) {}

    @Get("search-client")
    @Roles(Role.Client)
    async searchUser(@Query() query: SupplyPaginationDTO) {
        return this.supplyService.userSearch(query);
    }

    @Get("search-admin")
    @Roles(Role.Admin)
    async searchAdmin(@Query() query: SupplyPaginationDTO) {
        return this.supplyService.adminSearch(query);
    }
}