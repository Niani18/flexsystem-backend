import { Entity, FloatType, Property } from "@mikro-orm/core";
import { Supply, SupplyType } from "./supply.entity";

@Entity({ discriminatorValue: SupplyType.tube })
export class Tube extends Supply {

    constructor(){
        super()
        this.type = SupplyType.tube
    }

    @Property({ nullable: false, type: FloatType })
    length: number;
    
    @Property({ nullable: false, type: FloatType })
    diameter: number;
    
}