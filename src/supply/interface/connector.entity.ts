import { Entity, FloatType, Property } from "@mikro-orm/core";
import { Supply, SupplyType } from "./supply.entity";

@Entity({ discriminatorValue: SupplyType.connector })
export class Connector extends Supply {

    constructor(){
        super()
        this.type = SupplyType.connector
    }

    @Property({ nullable: false, unsigned: true, type: FloatType })
    minDiameter!: number;

    @Property({ nullable: false, unsigned: true, type: FloatType })
    maxDiameter!: number;
}