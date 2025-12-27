import { Cascade, DateTimeType, DecimalType, Entity, ManyToOne, OneToOne, Property, type Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Order } from "./order.entity.js";


@Entity()
export class Sign extends BaseEntity {

    @Property({ nullable: true, type: DateTimeType })
    dateTimeSign ?= new Date()

    @Property({ nullable: false, type: DecimalType, scale: 2 })
    amount!: string;

    @ManyToOne(()=> Order)
    order!: Rel<Order>
    
}