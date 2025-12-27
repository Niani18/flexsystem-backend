import { Entity, OneToMany, Property, Cascade, Collection, OneToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Order } from "../../order/interface/order.entity.js";
import { Role } from "../../auth/role.enum.js";
import { User } from "../../auth/interface/user.entity.js";


@Entity()
export class Client extends BaseEntity {
  
  @Property({nullable: false})
  cuit!: string;

  @Property({nullable: false})
  name!: string;

  @Property({nullable: false})
  surname!: string;

  @Property({nullable: false, unique: true})
  email!: string;

  @Property({nullable: false})
  phone!: string;

  @Property({nullable: false})
  adress!: string;

  @OneToMany(() => Order, (order) => order.client, {cascade: [Cascade.ALL]})
  order = new Collection<Order>(this);

  @OneToOne( ()=> User, (user) => user.client, { owner: true, nullable: false, cascade: [ Cascade.ALL ] })
  user!: Rel<User>


}
