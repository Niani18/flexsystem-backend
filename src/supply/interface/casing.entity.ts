import { Entity, Property } from "@mikro-orm/core";
import { Supply, SupplyType } from "./supply.entity";


@Entity({ discriminatorValue: SupplyType.casing })
export class Casing extends Supply {

    constructor(){
        super()
        this.type = SupplyType.casing
    }

    @Property({ nullable: false })
    material!: string;

    @Property({ nullable: false })
    conditions!: string;
}