import { Cascade, Collection, DateTimeType, Entity, EnumType, ManyToOne, OneToMany, OneToOne, Rel, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity";
import { Sign } from "./sign.entity";
import { Payment } from "./payment.entity";
import { Hose } from "../../order/interface/hose.entity.js";
import { Client } from "../../client/interface/client.entity.js"
import { Delivery } from "../../delivery/interface/delivery.entity.js";


export enum OrderState
{
    Pending = 'Pending',
    InProcess = 'InProcess',
    OnTheWay = 'OnTheWay',
    Delivered = 'Delivered',
    Payed = 'Payed'
}

@Entity()
export class Order extends BaseEntity {

    @Property({ nullable: true, type: DateTimeType })
    orderDate ?= new Date()

    @Property({ nullable: true, default: OrderState.Pending})
    state?: OrderState;

    @Property({nullable: false })
    deliveryMethod!: string;

    @Property({ nullable: false })
    paymentInterval!: number;

    @OneToMany(() => Sign, (sign) => sign.order, {cascade: [Cascade.ALL]})
    sign?= new Collection<Sign>(this);

    @OneToMany(() => Payment, (payment) => payment.order, {cascade: [Cascade.ALL]})
    payment?= new Collection<Payment>(this);

    @OneToMany(() => Hose, (hose) => hose.order, {cascade: [Cascade.ALL]})
    hose?= new Collection<Hose>(this)

    @ManyToOne(() => Client )
    client?: Rel<Client>

    @ManyToOne(() => Delivery, {nullable: true})
    delivery?: Rel<Delivery>;

}