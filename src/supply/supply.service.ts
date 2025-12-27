import { EntityManager } from "@mikro-orm/mysql";
import { Injectable } from "@nestjs/common";
import { Supply } from "./interface/supply.entity.js";
import { SupplyPaginationDTO } from "./dto/supply-pagination.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { SUPPLY_SORT_CONFIG } from "./sort/supply-sort.config.js";


@Injectable()
export class SupplyService {

    constructor(
        private readonly em: EntityManager
    ) {}


    async findById(id: number) : Promise<Supply | null> {
        return this.em.findOneOrFail(Supply, { id });
    }


    async userSearch(query: SupplyPaginationDTO) {
        const qb = this.em.qb(Supply, "sp");

        if (query.supplyType) qb.andWhere({ type: query.supplyType });
        if (query.minPrice) qb.andWhere({ price: { $gte: query.minPrice } });
        if(query.maxPrice) qb.andWhere({ price: { $lte: query.maxPrice } });

        const order = parseSort(SUPPLY_SORT_CONFIG, query.sort);
        for(const {column, dir} of order) {
            qb.orderBy({[column]: dir});
        }

        const [data, total] = await qb.limit(query.limit)
            .offset((query.page - 1) * query.limit)
            .getResultAndCount();

        return {
            data,
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / query.limit)),
            sort: order,
        }
    }

    async adminSearch(query: SupplyPaginationDTO) {
        const qb = this.em.qb(Supply, "sp")
        .leftJoinAndSelect("supplyHose", "sh")
        .leftJoinAndSelect("sh.hose", "ho");

        if (query.supplyType) qb.andWhere({ type: query.supplyType });
        if (query.minPrice) qb.andWhere({ price: { $gte: query.minPrice } });
        if (query.maxPrice) qb.andWhere({ price: { $lte: query.maxPrice } });
        if (query.minStock) qb.andWhere({ stock: { $gte: query.minStock } });
        if (query.maxStock) qb.andWhere({ stock: { $lte: query.maxStock } });
        

        const order = parseSort(SUPPLY_SORT_CONFIG, query.sort);
        for(const {column, dir} of order) {
            qb.orderBy({[column]: dir});
        }

        const [data, total] = await qb.limit(query.limit)
            .offset((query.page - 1) * query.limit)
            .getResultAndCount();

        return {
            data,
            page: query.page,
            limit: query.limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / query.limit)),
            sort: order,
        }
    }
}