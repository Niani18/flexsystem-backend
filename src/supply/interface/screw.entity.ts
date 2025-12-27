import { Entity, FloatType, Property } from "@mikro-orm/core";
import { Supply, SupplyType } from "./supply.entity.js";



@Entity({ discriminatorValue: SupplyType.screw })
export class Screw extends Supply {

    constructor(){
        super()
        this.type = SupplyType.screw
    }

    @Property({ nullable: false, type: FloatType })
    diameter: number;
}