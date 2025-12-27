import { Entity, FloatType, Property } from "@mikro-orm/core";
import { Supply, SupplyType } from "./supply.entity";



@Entity({ discriminatorValue: SupplyType.elbow })
export class Elbow extends Supply {
    
    constructor(){
        super()
        this.type = SupplyType.elbow
    }

    @Property({ nullable: false, type: FloatType })
    diameter!: number;
}