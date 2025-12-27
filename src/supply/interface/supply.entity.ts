import { BlobType, Cascade, Collection, DecimalType, Entity, Enum, IntegerType, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity";
import { SupplyHose } from "../../order/interface/supply-hose.entity.js";
import { SupplyImage } from "./supplyImage.entity.js";


export enum SupplyState {
    Available = "available",
    OutOfStock = "outofstock"
}

export enum SupplyType {
    connector = "connector",
    casing = "casing",
    screw = "screw",
    elbow = "elbow",
    tube = "tube"
}

@Entity({ abstract: true, discriminatorColumn: "type" })
export abstract class Supply extends BaseEntity
{
    @Property({ nullable: false, type: DecimalType, precision: 12, scale: 2 })
    price!: string;

    // @Property({ nullable: false, type: BlobType })
    // image!: Buffer; 

    @Property({ nullable: false })
    description!: string;

    @Property({ nullable: false, unsigned: true, type: IntegerType })
    stock!: number;

    @Property({ nullable: true, default: true})
    state?: SupplyState;

    @Enum(() => SupplyType)
    type?: SupplyType;

    @OneToMany(() => SupplyHose, (supplyHose) => supplyHose.supply, { cascade: [Cascade.ALL] })
    supplyHose = new Collection<SupplyHose>(this);

    @OneToMany(() => SupplyImage, (image) => image.supply, { cascade: [Cascade.ALL] })
    images = new Collection<SupplyImage>(this);
}