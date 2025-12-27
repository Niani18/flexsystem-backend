import { InjectRepository } from "@mikro-orm/nestjs";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Order, OrderState } from "./interface/order.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { OrderCreateDTO } from "./dto/order.dto.js";
import { Sign } from "./interface/sign.entity.js";
import { Payment } from "./interface/payment.entity.js";
import { Hose } from "./interface/hose.entity.js";
import { SupplyHose } from "./interface/supply-hose.entity.js";
import { OrderPaginationDTO } from "./dto/order-pagination.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { ORDER_SORT_CONFIG } from "./sort/order-sort.config.js";
import { PaymentDTO } from "./dto/payment.dto.js";
import { Supply } from "../supply/interface/supply.entity.js";
import { HoseDTO } from "./dto/hose.dto.js";
import { OrderClientQueryDTO } from "./dto/order-client-query.dto.js";


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: EntityRepository<Order>,
        private readonly em : EntityManager
    ) {}


    async findAll(): Promise<Order[] | null> {
        return this.orderRepository.findAll({populate: ['payment', 'sign', 'hose', 'hose.supplyHose', 'client']})
    }

    async search(query: OrderPaginationDTO){
        const qb = this.orderRepository.qb('o')
        qb.innerJoinAndSelect('o.client', 'cli')
        .innerJoinAndSelect('o.hose', "ho")
        .innerJoinAndSelect('ho.supplyHose', 'sh')
        .innerJoinAndSelect('sh.supply', 'sup')
        .leftJoinAndSelect('o.delivery', "de")
        .leftJoinAndSelect('o.payment', "p")
        .leftJoinAndSelect('o.sign', "s");


        if(query.orderId) { 
            qb.andWhere({ id: query.orderId });
        } else {
            if (query.state) qb.andWhere({ state: query.state });
            if (query.from) qb.andWhere({ orderDate: { $gte: query.from}});
            if (query.to) qb.andWhere({ orderDate: { $lte: query.to}});
            if (query.deliveryMethod) qb.andWhere({ deliveryMethod: query.deliveryMethod });
            if (query.clientId) qb.andWhere({ client: query.clientId });
        }


        const order = parseSort(ORDER_SORT_CONFIG, query.sort);
        for(const {column, dir} of order) {
            qb.orderBy({ [column]: dir });
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

    async clientSearch(query: OrderClientQueryDTO, clientId: number){
        const qb = this.orderRepository.qb('o')
        qb.innerJoinAndSelect('o.client', 'cli')
        .innerJoinAndSelect('o.hose', "ho")
        .innerJoinAndSelect('ho.supplyHose', 'sh')
        .innerJoinAndSelect('sh.supply', 'sup')
        .leftJoinAndSelect('o.delivery', "de")
        .leftJoinAndSelect('o.payment', "p")
        .leftJoinAndSelect('o.sign', "s")
        .andWhere({ client: clientId });


        if(query.orderId) { 
            qb.andWhere({ id: query.orderId });
        } else {
            if (query.state) qb.andWhere({ state: query.state });
            if (query.from) qb.andWhere({ orderDate: { $gte: query.from}});
            if (query.to) qb.andWhere({ orderDate: { $lte: query.to}});
            if (query.deliveryMethod) qb.andWhere({ deliveryMethod: query.deliveryMethod });
        }

        const order = parseSort(ORDER_SORT_CONFIG, query.sort);
        for(const {column, dir} of order) {
            qb.orderBy({ [column]: dir });
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

    async findById(id: number) : Promise<Order | null> {
        return this.orderRepository.findOneOrFail(id, {populate: ['payment', 'sign', 'hose', 'hose.supplyHose', 'client']});
    }
    
    async create(dto: OrderCreateDTO, clientId: number) : Promise<Order> {
        const {sign, hose, ...orderRest} = dto
        const order = this.orderRepository.create({...orderRest, client: clientId});
        await this.em.persistAndFlush(order);
        const comingSign = this.em.create(Sign, {
            amount: sign.amount,
            order,
        });
        await this.em.persistAndFlush(comingSign);
        for (const ho of hose){
            const {supplyHose, ...rest} = ho
            const commingHose = this.em.create(Hose, {
                length: rest.length,
                description: rest.description,
                ammount: rest.ammount,
                order
            })
            await this.em.persistAndFlush(commingHose)
            for (const sh of supplyHose){
                const supplyHoseComming = this.em.create(SupplyHose, {
                    amount: sh.amount,
                    supply: sh.supply,
                    hose: commingHose
                })
                await this.em.persistAndFlush(supplyHoseComming)  
            }
        }
        return order;
    }

    async updateOrder(id: number) : Promise<Order | null> {
        const order = await this.orderRepository.findOneOrFail({id}, {
            failHandler: () => {
                throw new NotFoundException("this order doesn't exist")
            }
        }) as Order;
        if (order.state !== OrderState.Pending){
            throw new ConflictException("Only pending orders can be updated")
        }
        order.state = OrderState.InProcess
        await this.em.persistAndFlush(order)
        return order;
    }

    async payment(id: number, dto: PaymentDTO) : Promise<Order | null> {
        const order = await this.orderRepository.findOneOrFail(id);
        if(dto){
            const paymentCreate = this.em.create(Payment, {
                amount: dto.amount,
                paymentMethod: dto.paymentMethod,
                order
            })
            await this.em.persistAndFlush(paymentCreate)
        }
        order.state = OrderState.Payed;
        await this.em.persistAndFlush(order)
        return order;
    }

    async replaceHoseInOrder(orderId: number, hoseId: number, dto: HoseDTO) {
    return this.em.transactional(async (em) => {
        // Verifico que la manguera existe dentro de la orden
        const hose = await em.findOne(Hose, { id: hoseId, order: orderId });
        if (!hose) throw new NotFoundException('Hose not found in this order');

        // 1) borrar hijos
        await em.nativeDelete(SupplyHose, { hose: hoseId });
        // 2) borrar la manguera
        await em.nativeDelete(Hose, { id: hoseId });

        // 3) crear la nueva
        const newHose = this.em.create(Hose, {
            length: dto.length,
            ammount: dto.ammount,
            description: dto.description,
            correction: dto.correction,
            dateOfCorrection: new Date(),
            order: em.getReference(Order, orderId),
        });

        for (const item of dto.supplyHose ?? []) {
        newHose.supplyHose.add(
            em.create(SupplyHose, {
            amount: item.amount,
            hose: newHose,
            supply: em.getReference(Supply, item.supply),
            }),
        );
        }

        await em.persistAndFlush(newHose);
        return newHose;
    });
    }


    async delete(id: number) : Promise<string> {
        const order = this.orderRepository.getReference(id);
        if (!order.id) throw new NotFoundException("Order not found");
        await this.em.removeAndFlush(order);
        return "Successfully deleted."
    }

}