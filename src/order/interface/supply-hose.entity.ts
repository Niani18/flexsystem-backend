import { Collection, Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { Hose } from "./hose.entity.js";
import { Supply } from "../../supply/interface/supply.entity.js";
import { BaseEntity } from "../../shared/interface/baseEntity.js";

@Entity()
export class SupplyHose extends BaseEntity {

  @Property({nullable: false})
  amount!: number

  @ManyToOne(() => Hose)
  hose!: Rel<Hose>

  @ManyToOne(() => Supply)
  supply!: Rel<Supply>

}