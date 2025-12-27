import { Cascade, Entity, EnumType, OneToOne, Property, type Rel } from "@mikro-orm/mysql";
import { BaseEntity } from "../../shared/interface/baseEntity.js";
import { Client } from "../../client/interface/client.entity.js";
import { Role } from "../../auth/role.enum.js";
import { Dealer } from "../../dealer/interface/dealer.entity.js";


@Entity()
export class User extends BaseEntity {

    @Property({ nullable: false, unique: true})
    username!: string;

    @Property({ nullable: false })
    password!: string;

    @Property({ nullable: true, default: Role.Client })
    role?: Role[];

    @OneToOne(() => Client, (client) => client.user, { nullable: true }) 
    client?: Rel<Client>

    @OneToOne(() => Dealer, (dealer) => dealer.user, { nullable: true }) 
    dealer?: Rel<Dealer>
}