import { Cascade, Collection, Entity, OneToMany, OneToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Delivery } from "../../delivery/interface/delivery.entity.js";
import { User } from "../../auth/interface/user.entity.js";

export enum DealerState {
  Free = "Free",
  Occuiped = "Occuiped",
  Down = "Down"
}

@Entity()
export class Dealer extends BaseEntity {

  @Property({nullable: false})
  cuil!: string

  @Property({nullable: false})
  name!: string

  @Property({nullable: false})
  surname!: string

  @Property({nullable: false})
  phone!: string

  @Property({default: DealerState.Free, nullable: true})
  state?: DealerState

  @OneToMany(() => Delivery, (delivery) => delivery.dealer, {cascade: [Cascade.ALL]})
  delivery ? = new Collection<Delivery>(this)

  @OneToOne( ()=> User, (user) => user.dealer, { owner: true, nullable: false, cascade: [ Cascade.ALL ]})
  user!: Rel<User>

}