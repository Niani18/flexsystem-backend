import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Delivery, DeliveryState } from "./interface/delivery.entity.js";
import { InjectRepository } from "@mikro-orm/nestjs";
import { DeliveryDTO } from "./dto/delivery.dto.js";
import { DeliveryUpdateDTO } from "./dto/delivery-update.dto.js";
import { DealerService } from "../dealer/dealer.service.js";
import { DeliveryPaginationDTO } from "./dto/delivery-pagination.dto.js";
import { parseSort } from "../shared/parse-sort.js";
import { DELIVERY_SORT } from "./sort/selivery.sort.js";
import { Dealer, DealerState } from "../dealer/interface/dealer.entity.js";
import { OrderService } from "../order/order.service.js";
import { Order, OrderState } from "../order/interface/order.entity.js";
import { Role } from "../auth/role.enum.js";


@Injectable()
export class DeliveryService {
    
    constructor(
        @InjectRepository(Delivery)
        private readonly deliveryRepository : EntityRepository<Delivery>,
        private readonly em: EntityManager,
        private readonly dealerRepository: DealerService,
        private readonly orderRepository: OrderService
    ) {}


    async findAll() : Promise<Delivery[]> {
        return this.deliveryRepository.findAll({populate: ['dealer', 'orders']});
    }

    async search(query: DeliveryPaginationDTO){
        const qb = this.deliveryRepository.qb('d')
        qb.leftJoinAndSelect('d.orders', 'o')
        .distinct();

        if (query.from) qb.andWhere ({ dateAprox: { $gte: new Date(query.from) } });
        if (query.to)   qb.andWhere ({ dateTimeAppointment: { $lte: new Date(query.to) } });
        if (query.state) qb.andWhere ({ state: query.state });
        if (query.dealer) qb.leftJoinAndSelect('d.dealer', 'de', {'de.id': query.dealer})
        else qb.leftJoinAndSelect('d.dealer', 'de')
    

        const order = parseSort<typeof DELIVERY_SORT>(DELIVERY_SORT, query.sort);
        for (const {column, dir} of order) {
            qb.orderBy({ [column]: dir });
        }

        const [data, total] = await qb
        .limit(query.limit)
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

    async findById(id: number) : Promise<Delivery | null> {
        return this.deliveryRepository.findOneOrFail({ id }, { 
            failHandler: () => {
                throw new NotFoundException("Couldn't find delivery with id " + id);
            },
        populate: ['dealer', 'orders']}); 
    }

    async create(dto : DeliveryDTO) : Promise<Delivery> {
        const delivery = this.deliveryRepository.create(dto);
        await this.em.persistAndFlush(delivery);
        return delivery;
    }

    async update(id: number, dto : DeliveryUpdateDTO) : Promise<Delivery | null> {
        const delivery = await this.deliveryRepository.findOneOrFail({ id }, { 
            populate: ['orders'],
            failHandler: () => {
                throw new NotFoundException("Couldn't find delivery with id " + id);
            }
        });

        if (delivery.state === DeliveryState.Done){
            throw new ConflictException ('this delivery is already finished')
        }

        if (dto.orders){

            for (const ord of dto.orders){
                const order = await this.orderRepository.findById(ord) as Order
                if (order.state !== OrderState.InProcess || order.delivery) 
                    throw new ConflictException (`the order with id ${order.id} is not in process state or is already assigned to a delivery`)
            }
        }

        if (dto.dealer)
        {
            if (delivery.orders == null || delivery.orders.length === 0)
                throw new ConflictException ('you cant assign a dealer to a delivery without orders')

            const idDealer = dto.dealer;
            const dealer = await this.dealerRepository.findOne(idDealer) 
            
            if(dealer && dealer.state === DealerState.Free)
            {
                dealer.state = DealerState.Occuiped;
                const { id, ...rest } = dealer
                await this.dealerRepository.update(idDealer, rest)
            }
            else throw new ConflictException ('the dealer is ocuppied')

            for (const ord of delivery.orders){
                const order = await this.orderRepository.findById(ord.id as number) as Order
                order.state = OrderState.OnTheWay
                await this.em.persistAndFlush(order)
            }
            
            delivery.dateBeg = new Date();
        }
        const updatedDelivery = this.deliveryRepository.assign(delivery, dto);
        await this.em.persistAndFlush(updatedDelivery);
        return updatedDelivery;
    }

    async delete(id: number) : Promise<string> {
        const delivery = this.deliveryRepository.getReference(id);
        if(!delivery.id) throw new NotFoundException("Delivery not found. Couldn't be deleted.");
        await this.em.removeAndFlush(delivery);
        return "Successfully deleted";
    }

    async getForDealer (user: any) {
        const qb = this.deliveryRepository.qb("d")
        qb.leftJoinAndSelect('d.dealer', 'de', {'de.id': user.sub})

        const [data] = await qb.getResultAndCount();
    
        return data

    }

    async delivered (id: number, user: any) {

        const delivery = await this.deliveryRepository.findOneOrFail ({id}, {
            populate: ['orders'],
            failHandler: () => {
                throw new NotFoundException('this delivery doesnt exist')
            }})
        if (user.role === Role.Dealer && user.sub !== delivery.dealer?.id){
            throw new ForbiddenException ("man, this is none of your business")
        }
        if (delivery.state === DeliveryState.Done){
            throw new ConflictException ('this delivery is already finished')
        }
        delivery.state = DeliveryState.Done

        if (delivery.orders){
            for (const ord of delivery.orders){
                const order = await this.orderRepository.findById(ord.id as number) as Order
                order.state = OrderState.Delivered
                await this.em.persistAndFlush(order)
            }
        }

        if (delivery.dealer)
        {
            const idDealer = delivery.dealer.id as number;
            const dealer = await this.dealerRepository.findOne(idDealer) 

            if(dealer)
            {
                dealer.state = DealerState.Free;
                const { id, ...rest } = dealer
                this.dealerRepository.update(idDealer, rest)
            }
        }

            delivery.dateEnd = new Date();
            await this.em.persistAndFlush(delivery)
            return delivery
    
    }
}