import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Dealer } from "./interface/dealer.entity.js";
import { DealerService } from "./dealer.service.js";
import { DealerController } from "./dealer.controller.js";
import { User } from "../auth/interface/user.entity.js";



@Module({
    imports: [
        MikroOrmModule.forFeature([Dealer, User])
    ],
    controllers: [DealerController],
    providers: [DealerService],
    exports: [DealerService]
})
export class DealerModule {}