import { Module } from "@nestjs/common";
import { DeliveryService } from "./delivery.service.js";
import { DeliveryController } from "./delivery.controller.js";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Delivery } from "./interface/delivery.entity.js";
import { DealerModule } from "../dealer/dealer.module.js";
import { OrderModule } from "../order/order.module.js";

@Module(
  {
    imports:[
      MikroOrmModule.forFeature([Delivery]),
      DealerModule,
      OrderModule
    ],
    providers:[ DeliveryService ],
    controllers:[ DeliveryController ]
  }
)

export class DeliveryModule {}