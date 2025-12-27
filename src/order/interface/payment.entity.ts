import { Cascade, DateTimeType, DecimalType, Entity, IntegerType, ManyToOne, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Order } from "./order.entity.js";


@Entity()
export class Payment extends BaseEntity {

    @Property({ nullable: true, type: DateTimeType })
    dateTimePayment ?= new Date();

    @Property({ nullable: true, type: IntegerType })
    delayDays ?: number

    @Property({ nullable: false, type: DecimalType, scale: 2 })
    amount!: string;

    @Property({ nullable: false })
    paymentMethod!: string;

    @Property({nullable: true, type: DecimalType, scale: 2, default: 0})
    extra?: string;

    @ManyToOne(()=> Order)
    order!: Rel<Order>
    
}