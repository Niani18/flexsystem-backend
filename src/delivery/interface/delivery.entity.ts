import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Dealer } from "../../dealer/interface/dealer.entity.js";
import { Order } from "../../order/interface/order.entity.js";


export enum DeliveryState {
  Pending = "PENDING",
  Done = "DONE"
}

@Entity()
export class Delivery extends BaseEntity {

  @Property({ nullable: true })
  dateBeg ?: Date;

  @Property({ nullable: true, default: DeliveryState.Pending })
  state?: DeliveryState;

  @Property({nullable: false})
  dateAprox!: Date 

  @Property({ nullable:true, default: null })
  dateEnd?: Date;
  
  @ManyToOne(() => Dealer, { nullable: true })
  dealer?: Rel<Dealer>;

  @OneToMany(() => Order, (order) => order.delivery , { cascade: [ Cascade.ALL ], nullable: true })
  orders ?= new Collection<Order>(this);
}