import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Order } from "./interface/order.entity";
import { Sign } from "./interface/sign.entity";
import { Payment } from "./interface/payment.entity";
import { Hose } from "./interface/hose.entity.js";
import { SupplyModule } from "../supply/supply.module.js";


@Module({
    imports: [
        MikroOrmModule.forFeature([
            Order,
            Sign,
            Payment,
            Hose
        ]),
        SupplyModule
    ],
    controllers: [ OrderController ],
    providers: [ OrderService ],
    exports: [OrderService]
})
export class OrderModule {}