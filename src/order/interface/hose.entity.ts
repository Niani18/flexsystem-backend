import { Cascade, Collection, DateTimeType, Entity, FloatType, ManyToMany, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Order } from "../../order/interface/order.entity.js";
import { SupplyHose } from "./supply-hose.entity.js";

@Entity()
export class Hose extends BaseEntity{

  @Property({nullable: false, type: FloatType})
  ammount!: number

  @Property({nullable: false})
  description!: string

  @Property({nullable: false, type: FloatType})
  length!: number

  @Property({nullable:true, default:null})
  correction?: string
  
  @Property({nullable: true, type:DateTimeType, default:null})
  dateOfCorrection?: Date

  @OneToMany(() => SupplyHose, (supplyHose) => supplyHose.hose, {cascade:[Cascade.ALL], orphanRemoval:true})
  supplyHose = new Collection<SupplyHose>(this)

  @ManyToOne(() => Order)
  order!: Rel<Order>
  
}