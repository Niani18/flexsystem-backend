import { BlobType, Entity, ManyToOne, Property, type Rel, StringType } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Supply } from "./supply.entity.js";


@Entity()
export class SupplyImage extends BaseEntity {
    @Property({ nullable: false, type: BlobType })
    image!: Buffer;

    @Property({ nullable: false, type: StringType })
    description!: string;

    @ManyToOne(() => Supply, { })
    supply!: Rel<Supply>;
}